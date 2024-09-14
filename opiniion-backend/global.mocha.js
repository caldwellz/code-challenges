/************************************
 * Mocha global setup and teardown  *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import mongoose from 'mongoose';
import { ephemeralMongoSetup, ephemeralMongoTeardown } from './lib/db_ephemeral.js';

/** Runs once before any test in any suite. */
export async function mochaGlobalSetup() {
  await ephemeralMongoSetup();
}

/** Runs once after all tests in all suites are finished. */
export async function mochaGlobalTeardown() {
  mongoose.models = {};
  mongoose.connection.close();
  await ephemeralMongoTeardown();
}
