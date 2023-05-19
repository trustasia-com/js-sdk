import * as pvtsutils from "pvtsutils";
import * as pkijs from "pkijs";
import * as asn1js from "asn1js";

function decodePEM(pem: string, tag = "[A-Z0-9 ]+"): ArrayBuffer[] {
  const pattern = new RegExp(
    `-{5}BEGIN ${tag}-{5}([a-zA-Z0-9=+\\/\\n\\r]+)-{5}END ${tag}-{5}`,
    "g"
  );

  const res: ArrayBuffer[] = [];
  let matches: RegExpExecArray | null = null;
  // eslint-disable-next-line no-cond-assign
  while ((matches = pattern.exec(pem))) {
    const base64 = matches[1].replace(/\r/g, "").replace(/\n/g, "");
    res.push(pvtsutils.Convert.FromBase64(base64));
  }

  return res;
}

export function parseCertificate(source: BufferSource): pkijs.Certificate[] {
  const buffers: ArrayBuffer[] = [];

  const buffer = pvtsutils.BufferSourceConverter.toArrayBuffer(source);
  const pem = pvtsutils.Convert.ToBinary(buffer);
  if (/----BEGIN CERTIFICATE-----/.test(pem)) {
    buffers.push(...decodePEM(pem, "CERTIFICATE"));
  } else {
    buffers.push(buffer);
  }

  const res: pkijs.Certificate[] = [];
  for (const item of buffers) {
    res.push(pkijs.Certificate.fromBER(item));
  }

  return res;
}

export function setCryptoEngine(webcrypto: Crypto) {
  const name = "wekeyCrypto";
  pkijs.setEngine(name, new pkijs.CryptoEngine({ name, crypto: webcrypto }));
}

export function getSubjectValue(
  tvs: pkijs.AttributeTypeAndValue[],
  type: string
): any {
  const tv = tvs.find((attr) => attr.type === type);
  if (tv) {
    return tv.value.valueBlock.value;
  }
}

export function calculateDigest(
  algo: string,
  data: BufferSource
): Promise<string> {
  return pkijs
    .getCrypto()
    .digest(algo, data)
    .then((hash) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    });
}

export async function checkRevocation(
  cert: pkijs.Certificate,
  issuer: pkijs.Certificate
): Promise<pkijs.CertificateStatus> {
  let ocspServer = "";
  for (const ext of cert.extensions!) {
    if (ext.extnID === "1.3.6.1.5.5.7.1.1") {
      const descs = ext.parsedValue.accessDescriptions;
      console.log(typeof descs, descs);
      for (const desc of descs) {
        if (desc.accessMethod === "1.3.6.1.5.5.7.48.1") {
          ocspServer = desc.accessLocation.value;
        }
      }
    }
  }
  if (!ocspServer) {
    throw Error("Not found ocsp server");
  }

  //#region Initial variables
  const ocspReqSimpl = new pkijs.OCSPRequest();
  //#endregion
  //#region Put static variables
  await ocspReqSimpl.createForCertificate(cert, {
    hashAlgorithm: "SHA-1",
    issuerCertificate: issuer,
  });
  const nonce = pkijs.getRandomValues(new Uint8Array(10));
  ocspReqSimpl.tbsRequest.requestExtensions = [
    new pkijs.Extension({
      extnID: "1.3.6.1.5.5.7.48.1.2", // nonce
      extnValue: new asn1js.OctetString({ valueHex: nonce.buffer }).toBER(),
    }),
  ];
  //#endregion

  // Encode OCSP request and put on the Web page
  const raw = await ocspReqSimpl.toSchema(true).toBER(false);
  const respRaw = await fetch(ocspServer, {
    method: "POST",
    body: raw,
    headers: {
      "Content-Type": "application/ocsp-request",
    },
  }).then((response) => {
    return response.arrayBuffer();
  });

  let ocspBasicResp: pkijs.BasicOCSPResponse;

  //#region Decode existing OCSP response
  const ocspRespSimpl = pkijs.OCSPResponse.fromBER(respRaw);

  if (ocspRespSimpl.responseBytes) {
    ocspBasicResp = pkijs.BasicOCSPResponse.fromBER(
      ocspRespSimpl.responseBytes.response.valueBlock.valueHexView
    );
  } else {
    throw new Error('No "ocspResp" in the OCSP Response - nothing to verify');
  }
  //#endregion
  return ocspBasicResp.getCertificateStatus(cert, issuer);
}
