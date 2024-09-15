/************************************
 * Repeating tasks setup            *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import updateUsersTask from './updateUsers.js';

const taskList = [updateUsersTask];

export function startTasks() {
  for (const task of taskList) {
    setInterval(task.callback, task.interval);
    if (task.runImmediately) setTimeout(task.callback, 0); // Add to the end of the event queue
  }
}
