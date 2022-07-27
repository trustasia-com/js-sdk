import sha256 from "crypto-js/sha256";
import encHex from "crypto-js/enc-hex";
import { parse } from "url";
import { uriEscapePath, iso8601, each } from "../util/util";

import { sumHMAC } from "./index";
import { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
// import { urlToHttpOptions } from "url";

// http header
const httpHeaderDate = "X-WeKey-Date";
const httpHeaderHost = "Host";
const httpHeaderAuthorization = "Authorization";

// Signature and API related constants
const signAlgorithmHMACN = "WEKEY-HMAC-SHA256";

// SignerDefault signatureDefault signer
//   payload: query or body
//   header
// https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
// eg.
//   GET
//   /
//   Action=ListUsers&Version=2010-05-08
//   content-type:application/x-www-form-urlencoded; charset=utf-8
//   host:iam.amazonaws.com
//   x-amz-date:20150830T123600Z
//
//   content-type;host;x-amz-date
//   e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
export function SignerDefault(
  req: AxiosRequestConfig,
  accessKey: string,
  secretKey: string,
  scope: string
) {
  if (!req.headers) {
    req.headers = {};
  }

  let canonicalReq: string[] = [];
  canonicalReq.push(req.method + "\n");

  const parsed = parse(req.url);
  req.headers[httpHeaderHost] = parsed.hostname;
  let pathname = parsed.pathname;
  if (pathname === "") {
    pathname = "/";
  }
  canonicalReq.push(pathname + "\n");

  canonicalReq.push(
    uriEscapePath(parsed.query ? parsed.query.substring(1) : "") + "\n"
  );
  // other headers
  const headers = getCanonicalHeaders(req.headers);
  canonicalReq.push(headers.canonicalHeaders + "\n");
  canonicalReq.push(headers.signedHeaders + "\n");

  let hash = encHex.stringify(sha256(req.data));
  canonicalReq.push(hash);
  hash = encHex.stringify(sha256(canonicalReq.join('')));

  // set headers
  const date = iso8601();
  req.headers[httpHeaderDate] = date;

  const credential = accessKey + "/" + scope;
  const stringToSign = `${signAlgorithmHMACN}\n${date}\n${scope}\n${hash}`;
  const signature = sumHMAC(stringToSign, secretKey);
  const authorization = `${signAlgorithmHMACN} ${credential},${headers.signedHeaders},${signature}`;
  req.headers[httpHeaderAuthorization] = authorization;
}

function getCanonicalHeaders(h: AxiosRequestHeaders): any {
  let hs: string[] = [];
  each(h, function (key: string) {
    if (key == "User-Agent") {
      return;
    }
    if (key == "Authorization") {
      return;
    }
    hs.push(key);
  });
  hs.sort();

  let headers = "";
  hs.forEach(function (value: string) {
    headers += value.toLowerCase() + ":" + h[value] + "\n";
  });
  return { signedHeaders: hs.join(";"), canonicalHeaders: headers };
}
