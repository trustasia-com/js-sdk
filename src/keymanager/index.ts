import * as pb from "./pb";

export class KeyManager {
  socket: WebSocket;

  constructor(endpoint: string) {
    const socket = new WebSocket(endpoint);
    socket.onopen = this.onSocketOpen;
    socket.onclose = this.onSocketClose;
    socket.onmessage = this.onSocketMessage;

    this.socket = socket;
  }

  // websocket event handler
  onSocketOpen(event: Event) {
    console.log("connection opened", event.target);
  }
  onSocketClose(event: CloseEvent) {
    console.log("connection closed: ", event.code, event.reason);
  }
  onSocketMessage(event: MessageEvent) {
    console.log("received a message");

    const obj = this.unmarshalProto(event.data);
    console.log(obj);
  }
  // send message
  send(mt: pb.MessageType, obj: object) {
    this.marshalProto(mt, obj);
  }

  // message encode / decode
  unmarshalProto(data: Uint8Array): object {
    const mt = new DataView(data.slice(0, 4)).getInt32(0, false);
    const body = data.slice(4);

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

  marshalProto(mt: pb.MessageType, msg: object): void {
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
