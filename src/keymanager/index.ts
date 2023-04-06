import * as pb from "./pb";

export class KeyManager {
  socket: WebSocket;
  alive: boolean;

  constructor(endpoint: string) {
    const socket = new WebSocket(endpoint);
    socket.onclose = (e) => this.onSocketClose(e);
    socket.onopen = (e) => this.onSocketOpen(e);
    socket.onmessage = (e) => this.onSocketMessage(e);
    socket.binaryType = "arraybuffer";

    this.alive = false;
    this.socket = socket;
  }

  // websocket event handler
  onSocketOpen(event: Event) {
    console.log("connection opened", event.target);
    this.alive = true;
  }
  onSocketClose(event: CloseEvent) {
    console.log("connection closed: ", event.code, event.reason);
    this.alive = false;
  }
  onSocketMessage(event: MessageEvent) {
    console.log("received a message");

    const obj = this.unmarshalProto(event.data);
    console.log(obj);
  }
  // export functions
  echoEvent(e: pb.EchoEvent) {
    const reqID = this.getReqID();
    console.log(reqID);
    this.send(pb.MessageType.Echo, e);
  }

  // request id
  private getReqID(): number {
    return Date.now();
  }
  // send message
  private send(mt: pb.MessageType, obj: object) {
    console.log("send: ", mt, this.alive);
    if (!this.alive) {
      throw Error("Websocket connection not alive");
    }
    this.marshalProto(mt, obj);
  }
  // message encode / decode
  private unmarshalProto(buf: ArrayBuffer) {
    const bytes = buf.slice(0, 4);
    const mt = new DataView(bytes).getInt32(0, false);
    const body = new Uint8Array(buf.slice(4));

    switch (pb.decodeMessageType[mt]) {
      case pb.MessageType.Echo:
        return pb.decodeEchoEvent(body);
      case pb.MessageType.Error:
        return pb.decodeErrorEvent(body);
      case pb.MessageType.CertList:
        return pb.decodeCertListEvent(body);
      case pb.MessageType.EmailInfo:
        return pb.decodeEmailInfoEvent(body);
      case pb.MessageType.SignEmail:
        return pb.decodeSignEmailEvent(body);
    }
    throw Error("Unsupported message type");
  }
  private marshalProto(mt: pb.MessageType, msg: object) {
    let data: Uint8Array;
    switch (mt) {
      case pb.MessageType.Echo:
        data = pb.encodeEchoEvent(msg);
        break;
      case pb.MessageType.CertList:
        data = pb.encodeCertListEvent(msg);
        break;
      case pb.MessageType.EmailInfo:
        data = pb.encodeEmailInfoEvent(msg);
        break;
      case pb.MessageType.SignEmail:
        data = pb.encodeSignEmailEvent(msg);
        break;
      default:
        throw Error("Unsupported message type");
    }
    // message type 4bytes
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setInt32(0, pb.encodeMessageType[mt], false);
    const mType = new Uint8Array(buf);
    // protobuf message
    const result = new Uint8Array(data.length + 4);
    result.set(mType, 0);
    result.set(data, 4);
    this.socket.send(result);
  }
}
