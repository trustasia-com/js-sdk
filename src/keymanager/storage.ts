import idb from "idb";

export class Storage {
  public static STORAGE_NAME = "km-remote";
  public static IDENTITY_STORAGE = "identity";
  public static REMOTE_STORAGE = "remoteIdentity";

  public static async create() {
    const db = await idb.openDB(this.STORAGE_NAME, 1);
    return new Storage(db);
  }

  protected db: idb.IDBPDatabase;

  private constructor(db: idb.IDBPDatabase) {
    this.db = db;
  }

//   public async loadIdentity() {}

//   public async saveIdentity(value: string) {}

//   public async loadRemoteIdentity(key: string) {}

//   public async saveRemoteIdentity(key: string, value: string) {}
}
