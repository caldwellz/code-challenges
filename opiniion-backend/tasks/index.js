/************************************
 * Repeating tasks setup            *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
const taskList = [];

export function startTasks() {
  for (const task of taskList) {
    setInterval(task.callback, task.interval);
    if (task.runImmediately) setTimeout(task.callback, 0); // Add to the end of the event queue
  }
}
