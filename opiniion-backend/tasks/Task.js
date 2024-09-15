/************************************
 * Task class                       *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
class Task {
  constructor(callback, interval, options = {}) {
    const { runImmediately = true } = options;
    this.callback = callback;
    this.interval = interval;
    this.runImmediately = runImmediately;
  }
}
export default Task;
