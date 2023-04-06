export const enum MessageType {
  Echo = "Echo",
  Error = "Error",
  Status = "Status",
  CertList = "CertList",
  CertDetail = "CertDetail",
  EmailInfo = "EmailInfo",
  SignEmail = "SignEmail",
  EncryptEmail = "EncryptEmail",
}

export const encodeMessageType: { [key: string]: number } = {
  Echo: 0,
  Error: 1,
  Status: 2,
  CertList: 3,
  CertDetail: 4,
  EmailInfo: 5,
  SignEmail: 6,
  EncryptEmail: 7,
};

export const decodeMessageType: { [key: number]: MessageType } = {
  0: MessageType.Echo,
  1: MessageType.Error,
  2: MessageType.Status,
  3: MessageType.CertList,
  4: MessageType.CertDetail,
  5: MessageType.EmailInfo,
  6: MessageType.SignEmail,
  7: MessageType.EncryptEmail,
};

export interface EchoEvent {
  msg?: string;
}

export function encodeEchoEvent(message: EchoEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeEchoEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeEchoEvent(message: EchoEvent, bb: ByteBuffer): void {
  // optional string msg = 1;
  let $msg = message.msg;
  if ($msg !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $msg);
  }
}

export function decodeEchoEvent(binary: Uint8Array): EchoEvent {
  return _decodeEchoEvent(wrapByteBuffer(binary));
}

function _decodeEchoEvent(bb: ByteBuffer): EchoEvent {
  let message: EchoEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string msg = 1;
      case 1: {
        message.msg = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ErrorEvent {
  code?: number;
  error?: string;
}

export function encodeErrorEvent(message: ErrorEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeErrorEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeErrorEvent(message: ErrorEvent, bb: ByteBuffer): void {
  // optional int32 code = 1;
  let $code = message.code;
  if ($code !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($code));
  }

  // optional string error = 2;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $error);
  }
}

export function decodeErrorEvent(binary: Uint8Array): ErrorEvent {
  return _decodeErrorEvent(wrapByteBuffer(binary));
}

function _decodeErrorEvent(bb: ByteBuffer): ErrorEvent {
  let message: ErrorEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 code = 1;
      case 1: {
        message.code = readVarint32(bb);
        break;
      }

      // optional string error = 2;
      case 2: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface StatusEvent {
  version?: string;
}

export function encodeStatusEvent(message: StatusEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeStatusEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeStatusEvent(message: StatusEvent, bb: ByteBuffer): void {
  // optional string version = 1;
  let $version = message.version;
  if ($version !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $version);
  }
}

export function decodeStatusEvent(binary: Uint8Array): StatusEvent {
  return _decodeStatusEvent(wrapByteBuffer(binary));
}

function _decodeStatusEvent(bb: ByteBuffer): StatusEvent {
  let message: StatusEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string version = 1;
      case 1: {
        message.version = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CertInfo {
  hash?: string;
  common_name?: string;
}

export function encodeCertInfo(message: CertInfo): Uint8Array {
  let bb = popByteBuffer();
  _encodeCertInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeCertInfo(message: CertInfo, bb: ByteBuffer): void {
  // optional string hash = 1;
  let $hash = message.hash;
  if ($hash !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $hash);
  }

  // optional string common_name = 2;
  let $common_name = message.common_name;
  if ($common_name !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $common_name);
  }
}

export function decodeCertInfo(binary: Uint8Array): CertInfo {
  return _decodeCertInfo(wrapByteBuffer(binary));
}

function _decodeCertInfo(bb: ByteBuffer): CertInfo {
  let message: CertInfo = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string hash = 1;
      case 1: {
        message.hash = readString(bb, readVarint32(bb));
        break;
      }

      // optional string common_name = 2;
      case 2: {
        message.common_name = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CertListEvent {
  certs?: CertInfo[];
  count?: number;
}

export function encodeCertListEvent(message: CertListEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeCertListEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeCertListEvent(message: CertListEvent, bb: ByteBuffer): void {
  // repeated CertInfo certs = 1;
  let array$certs = message.certs;
  if (array$certs !== undefined) {
    for (let value of array$certs) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeCertInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional int32 count = 2;
  let $count = message.count;
  if ($count !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, intToLong($count));
  }
}

export function decodeCertListEvent(binary: Uint8Array): CertListEvent {
  return _decodeCertListEvent(wrapByteBuffer(binary));
}

function _decodeCertListEvent(bb: ByteBuffer): CertListEvent {
  let message: CertListEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated CertInfo certs = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.certs || (message.certs = []);
        values.push(_decodeCertInfo(bb));
        bb.limit = limit;
        break;
      }

      // optional int32 count = 2;
      case 2: {
        message.count = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CertDetailEvent {
  raw?: Uint8Array;
  hash?: string;
  common_name?: string;
}

export function encodeCertDetailEvent(message: CertDetailEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeCertDetailEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeCertDetailEvent(message: CertDetailEvent, bb: ByteBuffer): void {
  // optional bytes raw = 1;
  let $raw = message.raw;
  if ($raw !== undefined) {
    writeVarint32(bb, 10);
    writeVarint32(bb, $raw.length), writeBytes(bb, $raw);
  }

  // optional string hash = 2;
  let $hash = message.hash;
  if ($hash !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $hash);
  }

  // optional string common_name = 3;
  let $common_name = message.common_name;
  if ($common_name !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $common_name);
  }
}

export function decodeCertDetailEvent(binary: Uint8Array): CertDetailEvent {
  return _decodeCertDetailEvent(wrapByteBuffer(binary));
}

function _decodeCertDetailEvent(bb: ByteBuffer): CertDetailEvent {
  let message: CertDetailEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bytes raw = 1;
      case 1: {
        message.raw = readBytes(bb, readVarint32(bb));
        break;
      }

      // optional string hash = 2;
      case 2: {
        message.hash = readString(bb, readVarint32(bb));
        break;
      }

      // optional string common_name = 3;
      case 3: {
        message.common_name = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface EmailInfoEvent {
  body?: Uint8Array;
  signed?: boolean;
  encrypted?: boolean;
  cert?: CertInfo;
  error?: string;
  reason?: string;
}

export function encodeEmailInfoEvent(message: EmailInfoEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeEmailInfoEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeEmailInfoEvent(message: EmailInfoEvent, bb: ByteBuffer): void {
  // optional bytes body = 1;
  let $body = message.body;
  if ($body !== undefined) {
    writeVarint32(bb, 10);
    writeVarint32(bb, $body.length), writeBytes(bb, $body);
  }

  // optional bool signed = 2;
  let $signed = message.signed;
  if ($signed !== undefined) {
    writeVarint32(bb, 16);
    writeByte(bb, $signed ? 1 : 0);
  }

  // optional bool encrypted = 3;
  let $encrypted = message.encrypted;
  if ($encrypted !== undefined) {
    writeVarint32(bb, 24);
    writeByte(bb, $encrypted ? 1 : 0);
  }

  // optional CertInfo cert = 4;
  let $cert = message.cert;
  if ($cert !== undefined) {
    writeVarint32(bb, 34);
    let nested = popByteBuffer();
    _encodeCertInfo($cert, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional string error = 5;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $error);
  }

  // optional string reason = 6;
  let $reason = message.reason;
  if ($reason !== undefined) {
    writeVarint32(bb, 50);
    writeString(bb, $reason);
  }
}

export function decodeEmailInfoEvent(binary: Uint8Array): EmailInfoEvent {
  return _decodeEmailInfoEvent(wrapByteBuffer(binary));
}

function _decodeEmailInfoEvent(bb: ByteBuffer): EmailInfoEvent {
  let message: EmailInfoEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bytes body = 1;
      case 1: {
        message.body = readBytes(bb, readVarint32(bb));
        break;
      }

      // optional bool signed = 2;
      case 2: {
        message.signed = !!readByte(bb);
        break;
      }

      // optional bool encrypted = 3;
      case 3: {
        message.encrypted = !!readByte(bb);
        break;
      }

      // optional CertInfo cert = 4;
      case 4: {
        let limit = pushTemporaryLength(bb);
        message.cert = _decodeCertInfo(bb);
        bb.limit = limit;
        break;
      }

      // optional string error = 5;
      case 5: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      // optional string reason = 6;
      case 6: {
        message.reason = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface SignEmailEvent {
  body?: Uint8Array;
  attachments?: string[];
  cert_hash?: string;
}

export function encodeSignEmailEvent(message: SignEmailEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeSignEmailEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeSignEmailEvent(message: SignEmailEvent, bb: ByteBuffer): void {
  // optional bytes body = 1;
  let $body = message.body;
  if ($body !== undefined) {
    writeVarint32(bb, 10);
    writeVarint32(bb, $body.length), writeBytes(bb, $body);
  }

  // repeated string attachments = 2;
  let array$attachments = message.attachments;
  if (array$attachments !== undefined) {
    for (let value of array$attachments) {
      writeVarint32(bb, 18);
      writeString(bb, value);
    }
  }

  // optional string cert_hash = 3;
  let $cert_hash = message.cert_hash;
  if ($cert_hash !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $cert_hash);
  }
}

export function decodeSignEmailEvent(binary: Uint8Array): SignEmailEvent {
  return _decodeSignEmailEvent(wrapByteBuffer(binary));
}

function _decodeSignEmailEvent(bb: ByteBuffer): SignEmailEvent {
  let message: SignEmailEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bytes body = 1;
      case 1: {
        message.body = readBytes(bb, readVarint32(bb));
        break;
      }

      // repeated string attachments = 2;
      case 2: {
        let values = message.attachments || (message.attachments = []);
        values.push(readString(bb, readVarint32(bb)));
        break;
      }

      // optional string cert_hash = 3;
      case 3: {
        message.cert_hash = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface EncryptEmailEvent {
  body?: Uint8Array;
  attachments?: string[];
  cert_hash?: string;
}

export function encodeEncryptEmailEvent(message: EncryptEmailEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodeEncryptEmailEvent(message, bb);
  return toUint8Array(bb);
}

function _encodeEncryptEmailEvent(message: EncryptEmailEvent, bb: ByteBuffer): void {
  // optional bytes body = 1;
  let $body = message.body;
  if ($body !== undefined) {
    writeVarint32(bb, 10);
    writeVarint32(bb, $body.length), writeBytes(bb, $body);
  }

  // repeated string attachments = 2;
  let array$attachments = message.attachments;
  if (array$attachments !== undefined) {
    for (let value of array$attachments) {
      writeVarint32(bb, 18);
      writeString(bb, value);
    }
  }

  // optional string cert_hash = 3;
  let $cert_hash = message.cert_hash;
  if ($cert_hash !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $cert_hash);
  }
}

export function decodeEncryptEmailEvent(binary: Uint8Array): EncryptEmailEvent {
  return _decodeEncryptEmailEvent(wrapByteBuffer(binary));
}

function _decodeEncryptEmailEvent(bb: ByteBuffer): EncryptEmailEvent {
  let message: EncryptEmailEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bytes body = 1;
      case 1: {
        message.body = readBytes(bb, readVarint32(bb));
        break;
      }

      // repeated string attachments = 2;
      case 2: {
        let values = message.attachments || (message.attachments = []);
        values.push(readString(bb, readVarint32(bb)));
        break;
      }

      // optional string cert_hash = 3;
      case 3: {
        message.cert_hash = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
