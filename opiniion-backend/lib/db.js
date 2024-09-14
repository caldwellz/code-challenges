/************************************
 * MongoDB database helpers         *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import mongoose from 'mongoose';

/** Connect to MongoDB using connection details from environment variables. */
export async function mongoConnect() {
  // Spin up a local in-memory database for testing if requested
  if (process.env.MONGO_EPHEMERAL === 'true') {
    // Not imported at top level because it imports mongodb-memory-server, which is a dev-only dependency
    const { ephemeralMongoSetup } = await import('./db_ephemeral.js');
    await ephemeralMongoSetup();
  }

  // These have to be destructured here instead of at top level since they might be overridden by ephemeralMongoSetup
  const {
    MONGO_URI = 'mongodb://127.0.0.1:27017/',
    MONGO_DATABASE = 'dev',
    MONGO_HEARTBEAT_FREQ = 5000,
    MONGO_SERVER_TIMEOUT = 10000,
  } = process.env;

  const connectStr = MONGO_URI + MONGO_DATABASE;
  console.log(`Connecting to database at '${connectStr}'`);
  await mongoose.connect(connectStr, {
    heartbeatFrequencyMS: parseInt(MONGO_HEARTBEAT_FREQ),
    serverSelectionTimeoutMS: MONGO_SERVER_TIMEOUT,
  });
}
