/************************************
 * Common middleware/error handling *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import { isCelebrateError } from 'celebrate';

const devMiddleware = [];

if (process.env.NODE_ENV === 'development') {
  // Add X-Response-Time headers
  devMiddleware.push(responseTime());
}

/** Validate that the supported input and output format(s) are acceptable.
 *
 * Only JSON bodies (if provided) and responses are currently supported.
 */
function checkContentType(req, res, next) {
  // This also returns true if the wildcard value was sent or the header was omitted.
  if (!req.accepts('json')) return res.status(406).json({ success: false, error: 'Not Acceptable' });

  // null means there's no body, while false means there's a non-matching one
  if (req.body && !req.is('json')) return res.status(415).json({ success: false, error: 'Unsupported Media Type' });
  next();
}

/** Route-not-found handler, to be placed after all other routes. */
function notFoundHandler(req, res) {
  res.status(404).json({ success: false, error: 'Not Found' });
}

/** Catch-all error handler.
 *
 * Must keep the 4-argument signature so Express recognizes it as an error handler:
 * https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Return validation errors as 400's with short but helpful messages
  if (isCelebrateError(err)) {
    const details = [];
    for (const [validationSource, { message }] of err.details.entries()) {
      details.push(`${validationSource}: ${message.replaceAll('"', "'")}`);
    }
    return res.status(400).json({ success: false, error: 'Bad Request', details });
  }

  // For everything else, log the details and return an opaque server error
  console.error('500 Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
}

/** Middleware meant to be added *before* API routes. */
export const prerouting = [...devMiddleware, helmet(), checkContentType, express.json()];

/** Middleware meant to be added *after* API routes. */
export const postrouting = [notFoundHandler, errorHandler];
