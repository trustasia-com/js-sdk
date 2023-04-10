import * as keychat from "@trustasia/keychat";
import { openDB, IDBPDatabase } from "idb";
import { HttpClient } from "../lib/client";

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
  protected remoteIdentity: keychat.Identity;
  protected client: HttpClient;

  private constructor(db: IDBPDatabase, host: string) {
    this.db = db;
    this.client = new HttpClient("http://" + host);

    // set crypto engine with webcrypto
    keychat.setEngine("web", crypto);
  }

  public async isLoggedIn(): Promise<boolean> {
    // send request to server ensure logged in

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
    const b64 = Buffer.from(buf).toString("base64");
    req = this.client.newRequest("/smime/handshake", "POST", b64);
    await this.client.request(req);
    return await cipher.Thumbprint(); // TODO
  }

  public async loadIdentity() {
    let resp: keychat.Identity = await this.db
      .transaction(Storage.IDENTITY_STORAGE)
      .objectStore(Storage.IDENTITY_STORAGE)
      .get(Storage.IDENTITY);
    if (!resp) {
      // init local identity
      resp = await keychat.Identity.generateIdentity("name");
      await this.saveIdentity();
    }
    this.identity = resp;
  }

  public async saveIdentity() {
    await this.db
      .transaction(Storage.IDENTITY_STORAGE, "readwrite")
      .objectStore(Storage.IDENTITY_STORAGE)
      .put(this.identity, Storage.IDENTITY);
  }

  public async loadRemoteIdentity(key: string) {
    const resp: keychat.Identity = await this.db
      .transaction(Storage.REMOTE_STORAGE)
      .objectStore(Storage.REMOTE_STORAGE)
      .get(key);
    this.remoteIdentity = resp;
  }

  public async saveRemoteIdentity(value: keychat.Identity) {
    await this.db
      .transaction(Storage.REMOTE_STORAGE, "readwrite")
      .objectStore(Storage.REMOTE_STORAGE)
      .put(value, Storage.REMOTE_IDENTITY);
  }
}
