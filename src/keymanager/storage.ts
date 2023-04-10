import * as keychat from "@trustasia/keychat";
import { openDB, IDBPDatabase } from "idb";
import { HttpClient } from "../lib/client";

export interface remoteIdentity {
  signingKey: CryptoKey;
  exchangeKey: CryptoKey;
}

export class Storage {
  public static STORAGE_NAME = "km-remote";
  public static IDENTITY_STORAGE = "identity";
  public static REMOTE_STORAGE = "remoteIdentity";
  public static IDENTITY = "identity";
  public static REMOTE_IDENTITY = "remoteIdentity";

  public static async create(endpoint: string) {
    const db = await openDB(this.STORAGE_NAME, 1, {
      upgrade(db, oldVersion) {
        if (oldVersion === 1) {
          db.deleteObjectStore(Storage.IDENTITY_STORAGE);
          db.deleteObjectStore(Storage.REMOTE_STORAGE);
        }
        db.createObjectStore(Storage.IDENTITY_STORAGE);
        db.createObjectStore(Storage.REMOTE_STORAGE);
      },
    });
    return new Storage(db, endpoint);
  }

  protected db: IDBPDatabase;
  protected identity: keychat.Identity;
  protected remoteIdentity: remoteIdentity;
  protected client: HttpClient;
  protected cipher: keychat.Cipher;

  private constructor(db: IDBPDatabase, host: string) {
    this.db = db;
    this.client = new HttpClient("http://" + host);

    // set crypto engine with webcrypto
    keychat.setEngine("web", crypto);
  }

  public async isLoggedIn(): Promise<boolean> {
    // send request to server ensure logged in
    await this.loadRemoteIdentity();
    if (!this.remoteIdentity) {
      return false;
    }
    // 请求state接口
    const cipher = await this.identity.NewCipher(
      this.remoteIdentity.signingKey,
      this.remoteIdentity.exchangeKey
    );
    // get plaintext
    const time = new Date().getTime();
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setFloat64(0, time);
    const data = await cipher.Encrypt(buf);
    let req = this.client.newRequest(
      "/smime/state",
      "POST",
      data.slice().buffer
    );
    req.withCredentials = false;
    const resp = await this.client.request(req);
    if (time != resp.decrypted) {
      return false;
    }
    this.cipher = cipher;
    return false;
  }

  public async handshakeServer(): Promise<string> {
    // request pre key
    let req = this.client.newRequest("/smime/prekey-bundle", "GET");
    req.withCredentials = false;
    const prekey = await this.client.request(req);
    let buf = Uint8Array.from(Buffer.from(prekey.pre_key_bundle, "base64"));

    const cipher = await this.identity.PreKey(buf);
    buf = await this.identity.NewHandshakeMsg(cipher.Secret);

    // handshake
    req = this.client.newRequest("/smime/handshake", "POST", buf.slice().buffer);
    req.withCredentials = false;
    req.headers = { "Content-Type": "application/octet-stream" };
    await this.client.request(req);

    // success
    this.remoteIdentity = {
      signingKey: cipher.RemoteSignedKey,
      exchangeKey: cipher.RemoteExchangeKey,
    };
    this.cipher = cipher;
    await this.saveRemoteIdentity();
    return await cipher.Thumbprint();
  }

  public async loadIdentity() {
    let resp: keychat.Identity = await this.db
      .transaction(Storage.IDENTITY_STORAGE)
      .objectStore(Storage.IDENTITY_STORAGE)
      .get(Storage.IDENTITY);

    let identity: keychat.Identity | null = null;
    if (!resp) {
      // init local identity
      identity = await keychat.Identity.generateIdentity("name");
      await this.saveIdentity();
    } else {
      identity = new keychat.Identity(
        resp.ID,
        resp.SignedKey,
        resp.ExchangeKey
      );
    }
    this.identity = identity;
  }

  public async saveIdentity() {
    await this.db
      .transaction(Storage.IDENTITY_STORAGE, "readwrite")
      .objectStore(Storage.IDENTITY_STORAGE)
      .put(this.identity, Storage.IDENTITY);
  }

  public async loadRemoteIdentity() {
    const resp: remoteIdentity = await this.db
      .transaction(Storage.REMOTE_STORAGE)
      .objectStore(Storage.REMOTE_STORAGE)
      .get(Storage.REMOTE_IDENTITY);
    this.remoteIdentity = resp;
  }

  public async saveRemoteIdentity() {
    await this.db
      .transaction(Storage.REMOTE_STORAGE, "readwrite")
      .objectStore(Storage.REMOTE_STORAGE)
      .put(this.remoteIdentity, Storage.REMOTE_IDENTITY);
  }
}
