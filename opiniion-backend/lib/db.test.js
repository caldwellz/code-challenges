/************************************
 * db helper tests                  *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import { mongoConnect } from './db.js';

describe('db', function () {
  describe('#mongoConnect', function () {
    it('succeeds', mongoConnect);
  });
});
