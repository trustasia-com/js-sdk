import * as pb from "./pb";
import { Storage } from "./storage";

export class KeyManager {
  // websocket
  protected socket: WebSocket;
  protected host: string;
  protected online: boolean;
  // emitter
  protected emitter: EventEmitter;
  // 回调函数：显示数字
  onShowDigit: (num: string) => void;
  onHideDigit: (ok: boolean) => void;
  onAliveStatus: (online: boolean) => void;
  // keychat
  protected storage: Storage;

  constructor(host: string, onDigit: (num: string) => void) {
    this.online = false;
    this.host = host;
    this.emitter = new EventEmitter();
    this.onShowDigit = onDigit;
    this.onHideDigit = function (ok: boolean) {
      console.log(ok);
    };
    this.onAliveStatus = function (online: boolean) {
      console.log("alive: ", online);
    };
  }
  // init some async params
  public async init() {
    // websocket
    await new Promise((resolve, reject) => {
      const socket = new WebSocket("ws://" + this.host + "/smime/wb");
      socket.onclose = (e) => {
        reject(e);
        this.onSocketClose(e);
      };
      socket.onopen = (e) => {
        resolve(e);
        this.onSocketOpen(e);
      };
      socket.onmessage = (e) => this.onSocketMessage(e);
      socket.binaryType = "arraybuffer";
      this.socket = socket;
    });

    // storage
    this.storage = await Storage.create(this.host);
    await this.storage.loadIdentity();
    // handshake
    const isLoggedIn = await this.storage.isLoggedIn();
    if (!isLoggedIn) {
      const num = await this.storage.handshakeServer(this.onHideDigit);
      this.onShowDigit(num);
    }
  }

  // websocket event handler
  onSocketOpen(event: Event) {
    console.log("connection opened", event.target);
    this.setOnline(true);
  }
  onSocketClose(event: CloseEvent) {
    console.log("connection closed: ", event.code, event.reason);
    this.setOnline(false);
  }
  protected async onSocketMessage(event: MessageEvent) {
    const obj = await this.unmarshalProto(event.data);
    console.log("received a message: ", obj);
    this.emitter.emit(obj.reqId, obj);
  }
  protected setOnline(ok: boolean) {
    this.online = ok;
    this.onAliveStatus(this.online);
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
  public async disposeEmailEvent(
    e: pb.DisposeEmailEventReq
  ): Promise<pb.DisposeEmailEventResp> {
    return this.promiseEvent(pb.EventType.DisposeEmail, e);
  }

  // promise event
  protected async promiseEvent(mt: pb.EventType, e: any): Promise<any> {
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
  protected send(mt: pb.EventType, obj: object) {
    if (!this.online) {
      throw Error("Websocket connection not alive");
    }
    this.marshalProto(mt, obj);
  }
  // message encode / decode
  protected async unmarshalProto(buf: ArrayBuffer) {
    const bytes = buf.slice(0, 4);
    const mt = new DataView(bytes).getInt32(0, false);
    const body = new Uint8Array(buf.slice(4));

    // decrypt
    const plaintext = await this.storage.cipher.Decrypt(body);
    const data = new Uint8Array(plaintext);
    switch (mt) {
      case pb.EventType.Echo:
        return pb.EchoEvent.decode(data);
      case pb.EventType.Error:
        return pb.ErrorEvent.decode(data);
      case pb.EventType.CertList:
        return pb.CertListEventResp.decode(data);
      case pb.EventType.EmailInfo:
        return pb.EmailInfoEventResp.decode(data);
      case pb.EventType.DisposeEmail:
        return pb.DisposeEmailEventResp.decode(data);
    }
    throw Error("Unsupported message type");
  }
  protected async marshalProto(mt: pb.EventType, msg: any) {
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
      case pb.EventType.DisposeEmail:
        data = pb.DisposeEmailEventReq.encode(msg).finish();
        break;
      default:
        throw Error("Unsupported message type");
    }
    // message type 4bytes
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setInt32(0, mt, false);
    const mType = new Uint8Array(buf);
    // encrypt
    const cipher = await this.storage.cipher.Encrypt(new Uint8Array(data));
    const result = new Uint8Array(cipher.length + 4);
    result.set(mType, 0);
    result.set(cipher, 4);
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
