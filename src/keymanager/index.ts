import * as pb from "./pb";
import { Storage } from "./storage";

export class KeyManager {
  // websocket
  socket: WebSocket;
  host: string;
  alive: boolean;
  // emitter
  emitter: EventEmitter;
  // 回调函数：显示数字
  onShowDigit: (num: string) => void;
  onHideDigit: (success: boolean) => void;
  onOffline: () => void;
  // keychat
  storage: Storage;

  constructor(host: string, onDigit?: (num: string) => void) {
    const socket = new WebSocket("ws://" + host + "/smime/wb");
    socket.onclose = (e) => this.onSocketClose(e);
    socket.onopen = (e) => this.onSocketOpen(e);
    socket.onmessage = (e) => this.onSocketMessage(e);
    socket.binaryType = "arraybuffer";

    this.alive = false;
    this.host = host;
    this.socket = socket;
    this.emitter = new EventEmitter();
    if (!onDigit) {
      onDigit = function (num: string) {
        alert("keymanager PIN: " + num);
      };
    }
    this.onShowDigit = onDigit;
    this.onHideDigit = function (success: boolean) {
      console.log(success);
    };
  }
  // init some async params
  public async init() {
    this.storage = await Storage.create(this.host);

    await this.storage.loadIdentity();

    const isLoggedIn = await this.storage.isLoggedIn();
    if (!isLoggedIn) {
      // handshake
      const num = await this.storage.handshakeServer(this.onHideDigit);
      this.onShowDigit(num);
    }
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
    this.emitter.emit(obj.reqId, obj);
  }
  // export functions
  public async echoEvent(e: pb.EchoEvent): Promise<pb.EchoEvent> {
    return this.promiseEvent(pb.EventType.Echo, e);
  }
  public async errorEvent(e: pb.ErrorEvent): Promise<pb.ErrorEvent> {
    return this.promiseEvent(pb.EventType.Error, e);
  }
  public async statusEvent(e: pb.StatusEventReq): Promise<pb.StatusEventResp> {
    return this.promiseEvent(pb.EventType.Status, e);
  }
  public async certListEvent(
    e: pb.CertListEventReq
  ): Promise<pb.CertListEventResp> {
    return this.promiseEvent(pb.EventType.CertList, e);
  }
  public async emailInfoEvent(
    e: pb.EmailInfoEventReq
  ): Promise<pb.EmailInfoEventResp> {
    return this.promiseEvent(pb.EventType.EmailInfo, e);
  }
  public async signEmailEvent(
    e: pb.SignEmailEventReq
  ): Promise<pb.SignEmailEventResp> {
    return this.promiseEvent(pb.EventType.SignEmail, e);
  }
  public async encryptEmailEvent(
    e: pb.EncryptEmailEventReq
  ): Promise<pb.EncryptEmailEventResp> {
    return this.promiseEvent(pb.EventType.EncryptEmail, e);
  }

  // promise event
  private async promiseEvent(mt: pb.EventType, e: any): Promise<any> {
    e.reqId = Date.now().toString(10);

    return new Promise((resolve, reject) => {
      this.send(mt, e);
      // timeout
      const timeoutID = setTimeout(() => {
        this.emitter.rm(e.reqId);
      }, 12 * 1000);
      // register
      this.emitter.on(
        e.reqId,
        (data) => {
          resolve(data);
          clearTimeout(timeoutID);
        },
        reject
      );
    });
  }
  // send message
  private send(mt: pb.EventType, obj: object) {
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

    switch (mt) {
      case pb.EventType.Echo:
        return pb.EchoEvent.decode(body);
      case pb.EventType.Error:
        return pb.ErrorEvent.decode(body);
      case pb.EventType.CertList:
        return pb.CertListEventResp.decode(body);
      case pb.EventType.EmailInfo:
        return pb.EmailInfoEventResp.decode(body);
      case pb.EventType.SignEmail:
        return pb.SignEmailEventResp.decode(body);
    }
    throw Error("Unsupported message type");
  }
  private marshalProto(mt: pb.EventType, msg: any) {
    let data: Uint8Array;
    switch (mt) {
      case pb.EventType.Echo:
        data = pb.EchoEvent.encode(msg).finish();
        break;
      case pb.EventType.CertList:
        data = pb.CertListEventReq.encode(msg).finish();
        break;
      case pb.EventType.EmailInfo:
        data = pb.EmailInfoEventReq.encode(msg).finish();
        break;
      case pb.EventType.SignEmail:
        data = pb.SignEmailEventReq.encode(msg).finish();
        break;
      default:
        throw Error("Unsupported message type");
    }
    // message type 4bytes
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setInt32(0, mt, false);
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
      cbs[1]("Message Handle Timeout");
    }
  }
}
