import * as pb from "./pb";

export class KeyManager {
  socket: WebSocket;
  alive: boolean;
  emitter: EventEmitter;

  constructor(endpoint: string) {
    const socket = new WebSocket(endpoint);
    socket.onclose = (e) => this.onSocketClose(e);
    socket.onopen = (e) => this.onSocketOpen(e);
    socket.onmessage = (e) => this.onSocketMessage(e);
    socket.binaryType = "arraybuffer";

    this.alive = false;
    this.socket = socket;
    this.emitter = new EventEmitter();
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
    const obj = this.unmarshalProto(event.data);
    console.log("received a message: ", obj);
    this.emitter.emit(obj.req_id, obj);
  }
  // export functions
  async echoEvent(e: pb.EchoEvent): Promise<pb.EchoEvent> {
    return this.promiseEvent(pb.MessageType.Echo, e);
  }
  async errorEvent(e: pb.ErrorEvent): Promise<pb.ErrorEvent> {
    return this.promiseEvent(pb.MessageType.Error, e);
  }
  async statusEvent(e: pb.StatusEvent): Promise<pb.StatusEvent> {
    return this.promiseEvent(pb.MessageType.Status, e);
  }
  async certListEvent(e: pb.CertListEvent): Promise<pb.CertListEvent> {
    return this.promiseEvent(pb.MessageType.CertList, e);
  }
  async emailInfoEvent(e: pb.EmailInfoEvent): Promise<pb.EmailInfoEvent> {
    return this.promiseEvent(pb.MessageType.EmailInfo, e);
  }
  async signEmailEvent(e: pb.SignEmailEvent): Promise<pb.SignEmailEvent> {
    return this.promiseEvent(pb.MessageType.SignEmail, e);
  }
  async encryptEmailEvent(
    e: pb.EncryptEmailEvent
  ): Promise<pb.EncryptEmailEvent> {
    return this.promiseEvent(pb.MessageType.EncryptEmail, e);
  }

  // promise event
  async promiseEvent(mt: pb.MessageType, e: any): Promise<any> {
    e.req_id = Date.now().toString(10);

    return new Promise((resolve, reject) => {
      this.send(mt, e);

      const timeoutID = setTimeout(() => {
        this.emitter.rm(e.req_id);
      }, 12 * 1000);
      this.emitter.on(
        e.req_id,
        (data) => {
          resolve(data);
          clearTimeout(timeoutID);
        },
        reject
      );
    });
  }
  // send message
  private send(mt: pb.MessageType, obj: object) {
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

class EventEmitter {
  private callbacks: Record<string, ((...args: any[]) => any)[]>;

  constructor() {
    this.callbacks = {};
  }

  on(event: string, cb: (data: any) => any, cb2: (data: any) => any) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb, cb2);
  }

  emit(event: string, data: any) {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs[0](data);
    }
  }

  rm(event: string) {
    let cbs = this.callbacks[event];
    if (cbs) {
      delete this.callbacks[event];
      cbs[1]("Timeout");
    }
  }
}
