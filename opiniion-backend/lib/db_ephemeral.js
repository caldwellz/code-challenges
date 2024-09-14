/************************************
 * Local MongoDB database setup     *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

/** Set up a shared ephemeral MongoDB instance for testing.
 * @returns {MongoMemoryServer} An in-memory MongoDB server.
 */
export async function ephemeralMongoSetup() {
  if (mongod !== null) return mongod;
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.MONGO_DATABASE = process.env.MONGO_DATABASE ?? 'local';

  // Since the DB is running locally, make the connection timeouts much shorter
  process.env.MONGO_HEARTBEAT_FREQ = 1000;
  process.env.MONGO_SERVER_TIMEOUT = 1500;

  return mongod;
}

/** Shut down the shared ephemeral MongoDB testing instance.
 * @returns {Boolean} Whether shutdown succeded.
 */
export async function ephemeralMongoTeardown() {
  return (await mongod?.stop?.()) ?? false;
}
