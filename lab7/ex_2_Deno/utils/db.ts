import { MongoClient, Database } from "https://deno.land/x/mongo/mod.ts";

let _db: Database;

const mongoConnect = async (callback: () => void): Promise<void> => {
  const client = new MongoClient();
  await client.connect("mongodb://127.0.0.1:27017");
  _db = client.database("guestbook");
  console.log('Connected!');
  callback();
};


const getDb = (): Database => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

export { mongoConnect, getDb };