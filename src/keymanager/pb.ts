/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

/** 枚举消息类型 */
export enum EventType {
  /** Echo - 回响消息 */
  Echo = 0,
  /** Error - 系统错误 */
  Error = 1,
  /** Status - 系统状态 */
  Status = 2,
  /** CertList - 获取证书列表 */
  CertList = 3,
  /** CertDetail - 证书详细 */
  CertDetail = 4,
  /** EmailInfo - 邮件信息 */
  EmailInfo = 5,
  /** DisposeEmail - 处理邮件 */
  DisposeEmail = 6,
  UNRECOGNIZED = -1,
}

export function eventTypeFromJSON(object: any): EventType {
  switch (object) {
    case 0:
    case "Echo":
      return EventType.Echo;
    case 1:
    case "Error":
      return EventType.Error;
    case 2:
    case "Status":
      return EventType.Status;
    case 3:
    case "CertList":
      return EventType.CertList;
    case 4:
    case "CertDetail":
      return EventType.CertDetail;
    case 5:
    case "EmailInfo":
      return EventType.EmailInfo;
    case 6:
    case "DisposeEmail":
      return EventType.DisposeEmail;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EventType.UNRECOGNIZED;
  }
}

export function eventTypeToJSON(object: EventType): string {
  switch (object) {
    case EventType.Echo:
      return "Echo";
    case EventType.Error:
      return "Error";
    case EventType.Status:
      return "Status";
    case EventType.CertList:
      return "CertList";
    case EventType.CertDetail:
      return "CertDetail";
    case EventType.EmailInfo:
      return "EmailInfo";
    case EventType.DisposeEmail:
      return "DisposeEmail";
    case EventType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface CertInfo {
  /** sha1 hash */
  hash: string;
  /** 通用名称 */
  commonName: string;
  /** 电子邮件 */
  emails: string[];
  /** 颁发者 */
  issuer: string;
}

export interface EchoEvent {
  reqId: string;
  msg: string;
}

export interface ErrorEvent {
  reqId: string;
  /** 错误码 */
  code: number;
  error: string;
}

export interface StatusEventReq {
  reqId: string;
  /** sdk服务版本 */
  version: string;
}

export interface StatusEventResp {
  reqId: string;
  /** 服务器版本 */
  version: string;
}

export interface CertListEventReq {
  reqId: string;
  /** 用于加密 */
  toEncrypt: boolean;
  /** 签名邮箱 */
  toSign: string;
}

export interface CertListEventResp {
  reqId: string;
  count: number;
  certs: CertInfo[];
}

export interface CertDetailEventReq {
  reqId: string;
  /** sha1 hash */
  hash: string;
}

export interface CertDetailEventResp {
  reqId: string;
  /** 证书原始数据DER */
  raw: Uint8Array;
  /** sha1 hash */
  hash: string;
  /** 通用名称 */
  commonName: string;
}

export interface EmailInfoEventReq {
  reqId: string;
  /** 请求密文-响应明文 */
  body: Uint8Array;
  /** 当前邮箱 */
  recipient: string;
}

export interface EmailInfoEventResp {
  reqId: string;
  /** 响应明文 */
  body: Uint8Array;
  /** 是否签名 */
  signed: boolean;
  /** 是否加密 */
  encrypted: boolean;
  /** 证书信息 */
  cert:
    | CertInfo
    | undefined;
  /** 验证解密错误 */
  error: string;
  /** 提示信息 */
  reason: string;
}

export interface Attachment {
  /** http:// or https:// or name */
  name: string;
  body: Uint8Array;
}

export interface DisposeEmailEventReq {
  reqId: string;
  /** 待加密签名内容 */
  body: Uint8Array;
  /** 附件或URL */
  attachments: Attachment[];
  /** 发送给，有值即加密 */
  tos: string[];
  /** 签名证书hash */
  signCert: string;
}

export interface DisposeEmailEventResp {
  reqId: string;
  /** 密文 */
  body: Uint8Array;
  /** 错误 */
  error: string;
  /** 提示信息 */
  reason: string;
}

function createBaseCertInfo(): CertInfo {
  return { hash: "", commonName: "", emails: [], issuer: "" };
}

export const CertInfo = {
  encode(message: CertInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    if (message.commonName !== "") {
      writer.uint32(18).string(message.commonName);
    }
    for (const v of message.emails) {
      writer.uint32(26).string(v!);
    }
    if (message.issuer !== "") {
      writer.uint32(34).string(message.issuer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CertInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCertInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.hash = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.commonName = reader.string();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.emails.push(reader.string());
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.issuer = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CertInfo {
    return {
      hash: isSet(object.hash) ? String(object.hash) : "",
      commonName: isSet(object.commonName) ? String(object.commonName) : "",
      emails: Array.isArray(object?.emails) ? object.emails.map((e: any) => String(e)) : [],
      issuer: isSet(object.issuer) ? String(object.issuer) : "",
    };
  },

  toJSON(message: CertInfo): unknown {
    const obj: any = {};
    message.hash !== undefined && (obj.hash = message.hash);
    message.commonName !== undefined && (obj.commonName = message.commonName);
    if (message.emails) {
      obj.emails = message.emails.map((e) => e);
    } else {
      obj.emails = [];
    }
    message.issuer !== undefined && (obj.issuer = message.issuer);
    return obj;
  },

  create<I extends Exact<DeepPartial<CertInfo>, I>>(base?: I): CertInfo {
    return CertInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CertInfo>, I>>(object: I): CertInfo {
    const message = createBaseCertInfo();
    message.hash = object.hash ?? "";
    message.commonName = object.commonName ?? "";
    message.emails = object.emails?.map((e) => e) || [];
    message.issuer = object.issuer ?? "";
    return message;
  },
};

function createBaseEchoEvent(): EchoEvent {
  return { reqId: "", msg: "" };
}

export const EchoEvent = {
  encode(message: EchoEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.msg !== "") {
      writer.uint32(18).string(message.msg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EchoEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEchoEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.msg = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EchoEvent {
    return { reqId: isSet(object.reqId) ? String(object.reqId) : "", msg: isSet(object.msg) ? String(object.msg) : "" };
  },

  toJSON(message: EchoEvent): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },

  create<I extends Exact<DeepPartial<EchoEvent>, I>>(base?: I): EchoEvent {
    return EchoEvent.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EchoEvent>, I>>(object: I): EchoEvent {
    const message = createBaseEchoEvent();
    message.reqId = object.reqId ?? "";
    message.msg = object.msg ?? "";
    return message;
  },
};

function createBaseErrorEvent(): ErrorEvent {
  return { reqId: "", code: 0, error: "" };
}

export const ErrorEvent = {
  encode(message: ErrorEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.code !== 0) {
      writer.uint32(16).int32(message.code);
    }
    if (message.error !== "") {
      writer.uint32(26).string(message.error);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ErrorEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseErrorEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.code = reader.int32();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.error = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ErrorEvent {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      code: isSet(object.code) ? Number(object.code) : 0,
      error: isSet(object.error) ? String(object.error) : "",
    };
  },

  toJSON(message: ErrorEvent): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.code !== undefined && (obj.code = Math.round(message.code));
    message.error !== undefined && (obj.error = message.error);
    return obj;
  },

  create<I extends Exact<DeepPartial<ErrorEvent>, I>>(base?: I): ErrorEvent {
    return ErrorEvent.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ErrorEvent>, I>>(object: I): ErrorEvent {
    const message = createBaseErrorEvent();
    message.reqId = object.reqId ?? "";
    message.code = object.code ?? 0;
    message.error = object.error ?? "";
    return message;
  },
};

function createBaseStatusEventReq(): StatusEventReq {
  return { reqId: "", version: "" };
}

export const StatusEventReq = {
  encode(message: StatusEventReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusEventReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusEventReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.version = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StatusEventReq {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      version: isSet(object.version) ? String(object.version) : "",
    };
  },

  toJSON(message: StatusEventReq): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  create<I extends Exact<DeepPartial<StatusEventReq>, I>>(base?: I): StatusEventReq {
    return StatusEventReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StatusEventReq>, I>>(object: I): StatusEventReq {
    const message = createBaseStatusEventReq();
    message.reqId = object.reqId ?? "";
    message.version = object.version ?? "";
    return message;
  },
};

function createBaseStatusEventResp(): StatusEventResp {
  return { reqId: "", version: "" };
}

export const StatusEventResp = {
  encode(message: StatusEventResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusEventResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusEventResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.version = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StatusEventResp {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      version: isSet(object.version) ? String(object.version) : "",
    };
  },

  toJSON(message: StatusEventResp): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  create<I extends Exact<DeepPartial<StatusEventResp>, I>>(base?: I): StatusEventResp {
    return StatusEventResp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StatusEventResp>, I>>(object: I): StatusEventResp {
    const message = createBaseStatusEventResp();
    message.reqId = object.reqId ?? "";
    message.version = object.version ?? "";
    return message;
  },
};

function createBaseCertListEventReq(): CertListEventReq {
  return { reqId: "", toEncrypt: false, toSign: "" };
}

export const CertListEventReq = {
  encode(message: CertListEventReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.toEncrypt === true) {
      writer.uint32(16).bool(message.toEncrypt);
    }
    if (message.toSign !== "") {
      writer.uint32(26).string(message.toSign);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CertListEventReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCertListEventReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.toEncrypt = reader.bool();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.toSign = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CertListEventReq {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      toEncrypt: isSet(object.toEncrypt) ? Boolean(object.toEncrypt) : false,
      toSign: isSet(object.toSign) ? String(object.toSign) : "",
    };
  },

  toJSON(message: CertListEventReq): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.toEncrypt !== undefined && (obj.toEncrypt = message.toEncrypt);
    message.toSign !== undefined && (obj.toSign = message.toSign);
    return obj;
  },

  create<I extends Exact<DeepPartial<CertListEventReq>, I>>(base?: I): CertListEventReq {
    return CertListEventReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CertListEventReq>, I>>(object: I): CertListEventReq {
    const message = createBaseCertListEventReq();
    message.reqId = object.reqId ?? "";
    message.toEncrypt = object.toEncrypt ?? false;
    message.toSign = object.toSign ?? "";
    return message;
  },
};

function createBaseCertListEventResp(): CertListEventResp {
  return { reqId: "", count: 0, certs: [] };
}

export const CertListEventResp = {
  encode(message: CertListEventResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.count !== 0) {
      writer.uint32(16).int32(message.count);
    }
    for (const v of message.certs) {
      CertInfo.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CertListEventResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCertListEventResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.count = reader.int32();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.certs.push(CertInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CertListEventResp {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      count: isSet(object.count) ? Number(object.count) : 0,
      certs: Array.isArray(object?.certs) ? object.certs.map((e: any) => CertInfo.fromJSON(e)) : [],
    };
  },

  toJSON(message: CertListEventResp): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.count !== undefined && (obj.count = Math.round(message.count));
    if (message.certs) {
      obj.certs = message.certs.map((e) => e ? CertInfo.toJSON(e) : undefined);
    } else {
      obj.certs = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CertListEventResp>, I>>(base?: I): CertListEventResp {
    return CertListEventResp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CertListEventResp>, I>>(object: I): CertListEventResp {
    const message = createBaseCertListEventResp();
    message.reqId = object.reqId ?? "";
    message.count = object.count ?? 0;
    message.certs = object.certs?.map((e) => CertInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCertDetailEventReq(): CertDetailEventReq {
  return { reqId: "", hash: "" };
}

export const CertDetailEventReq = {
  encode(message: CertDetailEventReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.hash !== "") {
      writer.uint32(18).string(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CertDetailEventReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCertDetailEventReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.hash = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CertDetailEventReq {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      hash: isSet(object.hash) ? String(object.hash) : "",
    };
  },

  toJSON(message: CertDetailEventReq): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.hash !== undefined && (obj.hash = message.hash);
    return obj;
  },

  create<I extends Exact<DeepPartial<CertDetailEventReq>, I>>(base?: I): CertDetailEventReq {
    return CertDetailEventReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CertDetailEventReq>, I>>(object: I): CertDetailEventReq {
    const message = createBaseCertDetailEventReq();
    message.reqId = object.reqId ?? "";
    message.hash = object.hash ?? "";
    return message;
  },
};

function createBaseCertDetailEventResp(): CertDetailEventResp {
  return { reqId: "", raw: new Uint8Array(), hash: "", commonName: "" };
}

export const CertDetailEventResp = {
  encode(message: CertDetailEventResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.raw.length !== 0) {
      writer.uint32(18).bytes(message.raw);
    }
    if (message.hash !== "") {
      writer.uint32(26).string(message.hash);
    }
    if (message.commonName !== "") {
      writer.uint32(34).string(message.commonName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CertDetailEventResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCertDetailEventResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.raw = reader.bytes();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.hash = reader.string();
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.commonName = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CertDetailEventResp {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      raw: isSet(object.raw) ? bytesFromBase64(object.raw) : new Uint8Array(),
      hash: isSet(object.hash) ? String(object.hash) : "",
      commonName: isSet(object.commonName) ? String(object.commonName) : "",
    };
  },

  toJSON(message: CertDetailEventResp): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.raw !== undefined &&
      (obj.raw = base64FromBytes(message.raw !== undefined ? message.raw : new Uint8Array()));
    message.hash !== undefined && (obj.hash = message.hash);
    message.commonName !== undefined && (obj.commonName = message.commonName);
    return obj;
  },

  create<I extends Exact<DeepPartial<CertDetailEventResp>, I>>(base?: I): CertDetailEventResp {
    return CertDetailEventResp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CertDetailEventResp>, I>>(object: I): CertDetailEventResp {
    const message = createBaseCertDetailEventResp();
    message.reqId = object.reqId ?? "";
    message.raw = object.raw ?? new Uint8Array();
    message.hash = object.hash ?? "";
    message.commonName = object.commonName ?? "";
    return message;
  },
};

function createBaseEmailInfoEventReq(): EmailInfoEventReq {
  return { reqId: "", body: new Uint8Array(), recipient: "" };
}

export const EmailInfoEventReq = {
  encode(message: EmailInfoEventReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.body.length !== 0) {
      writer.uint32(18).bytes(message.body);
    }
    if (message.recipient !== "") {
      writer.uint32(26).string(message.recipient);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EmailInfoEventReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailInfoEventReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.body = reader.bytes();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.recipient = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailInfoEventReq {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      body: isSet(object.body) ? bytesFromBase64(object.body) : new Uint8Array(),
      recipient: isSet(object.recipient) ? String(object.recipient) : "",
    };
  },

  toJSON(message: EmailInfoEventReq): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.body !== undefined &&
      (obj.body = base64FromBytes(message.body !== undefined ? message.body : new Uint8Array()));
    message.recipient !== undefined && (obj.recipient = message.recipient);
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailInfoEventReq>, I>>(base?: I): EmailInfoEventReq {
    return EmailInfoEventReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EmailInfoEventReq>, I>>(object: I): EmailInfoEventReq {
    const message = createBaseEmailInfoEventReq();
    message.reqId = object.reqId ?? "";
    message.body = object.body ?? new Uint8Array();
    message.recipient = object.recipient ?? "";
    return message;
  },
};

function createBaseEmailInfoEventResp(): EmailInfoEventResp {
  return { reqId: "", body: new Uint8Array(), signed: false, encrypted: false, cert: undefined, error: "", reason: "" };
}

export const EmailInfoEventResp = {
  encode(message: EmailInfoEventResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.body.length !== 0) {
      writer.uint32(18).bytes(message.body);
    }
    if (message.signed === true) {
      writer.uint32(24).bool(message.signed);
    }
    if (message.encrypted === true) {
      writer.uint32(32).bool(message.encrypted);
    }
    if (message.cert !== undefined) {
      CertInfo.encode(message.cert, writer.uint32(42).fork()).ldelim();
    }
    if (message.error !== "") {
      writer.uint32(50).string(message.error);
    }
    if (message.reason !== "") {
      writer.uint32(58).string(message.reason);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EmailInfoEventResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailInfoEventResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.body = reader.bytes();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.signed = reader.bool();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.encrypted = reader.bool();
          continue;
        case 5:
          if (tag != 42) {
            break;
          }

          message.cert = CertInfo.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag != 50) {
            break;
          }

          message.error = reader.string();
          continue;
        case 7:
          if (tag != 58) {
            break;
          }

          message.reason = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailInfoEventResp {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      body: isSet(object.body) ? bytesFromBase64(object.body) : new Uint8Array(),
      signed: isSet(object.signed) ? Boolean(object.signed) : false,
      encrypted: isSet(object.encrypted) ? Boolean(object.encrypted) : false,
      cert: isSet(object.cert) ? CertInfo.fromJSON(object.cert) : undefined,
      error: isSet(object.error) ? String(object.error) : "",
      reason: isSet(object.reason) ? String(object.reason) : "",
    };
  },

  toJSON(message: EmailInfoEventResp): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.body !== undefined &&
      (obj.body = base64FromBytes(message.body !== undefined ? message.body : new Uint8Array()));
    message.signed !== undefined && (obj.signed = message.signed);
    message.encrypted !== undefined && (obj.encrypted = message.encrypted);
    message.cert !== undefined && (obj.cert = message.cert ? CertInfo.toJSON(message.cert) : undefined);
    message.error !== undefined && (obj.error = message.error);
    message.reason !== undefined && (obj.reason = message.reason);
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailInfoEventResp>, I>>(base?: I): EmailInfoEventResp {
    return EmailInfoEventResp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EmailInfoEventResp>, I>>(object: I): EmailInfoEventResp {
    const message = createBaseEmailInfoEventResp();
    message.reqId = object.reqId ?? "";
    message.body = object.body ?? new Uint8Array();
    message.signed = object.signed ?? false;
    message.encrypted = object.encrypted ?? false;
    message.cert = (object.cert !== undefined && object.cert !== null) ? CertInfo.fromPartial(object.cert) : undefined;
    message.error = object.error ?? "";
    message.reason = object.reason ?? "";
    return message;
  },
};

function createBaseAttachment(): Attachment {
  return { name: "", body: new Uint8Array() };
}

export const Attachment = {
  encode(message: Attachment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.body.length !== 0) {
      writer.uint32(18).bytes(message.body);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Attachment {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAttachment();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.body = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Attachment {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      body: isSet(object.body) ? bytesFromBase64(object.body) : new Uint8Array(),
    };
  },

  toJSON(message: Attachment): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.body !== undefined &&
      (obj.body = base64FromBytes(message.body !== undefined ? message.body : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<Attachment>, I>>(base?: I): Attachment {
    return Attachment.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Attachment>, I>>(object: I): Attachment {
    const message = createBaseAttachment();
    message.name = object.name ?? "";
    message.body = object.body ?? new Uint8Array();
    return message;
  },
};

function createBaseDisposeEmailEventReq(): DisposeEmailEventReq {
  return { reqId: "", body: new Uint8Array(), attachments: [], tos: [], signCert: "" };
}

export const DisposeEmailEventReq = {
  encode(message: DisposeEmailEventReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.body.length !== 0) {
      writer.uint32(18).bytes(message.body);
    }
    for (const v of message.attachments) {
      Attachment.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.tos) {
      writer.uint32(34).string(v!);
    }
    if (message.signCert !== "") {
      writer.uint32(42).string(message.signCert);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DisposeEmailEventReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDisposeEmailEventReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.body = reader.bytes();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.attachments.push(Attachment.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.tos.push(reader.string());
          continue;
        case 5:
          if (tag != 42) {
            break;
          }

          message.signCert = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DisposeEmailEventReq {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      body: isSet(object.body) ? bytesFromBase64(object.body) : new Uint8Array(),
      attachments: Array.isArray(object?.attachments) ? object.attachments.map((e: any) => Attachment.fromJSON(e)) : [],
      tos: Array.isArray(object?.tos) ? object.tos.map((e: any) => String(e)) : [],
      signCert: isSet(object.signCert) ? String(object.signCert) : "",
    };
  },

  toJSON(message: DisposeEmailEventReq): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.body !== undefined &&
      (obj.body = base64FromBytes(message.body !== undefined ? message.body : new Uint8Array()));
    if (message.attachments) {
      obj.attachments = message.attachments.map((e) => e ? Attachment.toJSON(e) : undefined);
    } else {
      obj.attachments = [];
    }
    if (message.tos) {
      obj.tos = message.tos.map((e) => e);
    } else {
      obj.tos = [];
    }
    message.signCert !== undefined && (obj.signCert = message.signCert);
    return obj;
  },

  create<I extends Exact<DeepPartial<DisposeEmailEventReq>, I>>(base?: I): DisposeEmailEventReq {
    return DisposeEmailEventReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DisposeEmailEventReq>, I>>(object: I): DisposeEmailEventReq {
    const message = createBaseDisposeEmailEventReq();
    message.reqId = object.reqId ?? "";
    message.body = object.body ?? new Uint8Array();
    message.attachments = object.attachments?.map((e) => Attachment.fromPartial(e)) || [];
    message.tos = object.tos?.map((e) => e) || [];
    message.signCert = object.signCert ?? "";
    return message;
  },
};

function createBaseDisposeEmailEventResp(): DisposeEmailEventResp {
  return { reqId: "", body: new Uint8Array(), error: "", reason: "" };
}

export const DisposeEmailEventResp = {
  encode(message: DisposeEmailEventResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reqId !== "") {
      writer.uint32(10).string(message.reqId);
    }
    if (message.body.length !== 0) {
      writer.uint32(18).bytes(message.body);
    }
    if (message.error !== "") {
      writer.uint32(26).string(message.error);
    }
    if (message.reason !== "") {
      writer.uint32(34).string(message.reason);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DisposeEmailEventResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDisposeEmailEventResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.reqId = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.body = reader.bytes();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.error = reader.string();
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.reason = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DisposeEmailEventResp {
    return {
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
      body: isSet(object.body) ? bytesFromBase64(object.body) : new Uint8Array(),
      error: isSet(object.error) ? String(object.error) : "",
      reason: isSet(object.reason) ? String(object.reason) : "",
    };
  },

  toJSON(message: DisposeEmailEventResp): unknown {
    const obj: any = {};
    message.reqId !== undefined && (obj.reqId = message.reqId);
    message.body !== undefined &&
      (obj.body = base64FromBytes(message.body !== undefined ? message.body : new Uint8Array()));
    message.error !== undefined && (obj.error = message.error);
    message.reason !== undefined && (obj.reason = message.reason);
    return obj;
  },

  create<I extends Exact<DeepPartial<DisposeEmailEventResp>, I>>(base?: I): DisposeEmailEventResp {
    return DisposeEmailEventResp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DisposeEmailEventResp>, I>>(object: I): DisposeEmailEventResp {
    const message = createBaseDisposeEmailEventResp();
    message.reqId = object.reqId ?? "";
    message.body = object.body ?? new Uint8Array();
    message.error = object.error ?? "";
    message.reason = object.reason ?? "";
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
