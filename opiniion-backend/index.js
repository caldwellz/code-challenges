/************************************
 * API server entry point           *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import express from 'express';
import v1 from './v1/index.js';
import { prerouting, postrouting } from './lib/middleware.js';
import { mongoConnect } from './lib/db.js';
import { startTasks } from './tasks/index.js';

const app = express();
const { NODE_ENV, HOST = '127.0.0.1', PORT = 8080 } = process.env;

// Versioned API handler(s) and common middleware
app.use(prerouting);
app.use('/v1', v1);
app.use(postrouting);

async function main() {
  await mongoConnect();
  startTasks();
  app.listen(parseInt(PORT), HOST, () => {
    console.log(`Running on ${HOST}:${PORT} in '${NODE_ENV}' mode.`);
  });
}
main();
