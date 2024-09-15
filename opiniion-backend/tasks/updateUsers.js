/************************************
 * A task to fetch and update users *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import User from '../models/User.js';
import Task from './Task.js';

const { UPDATE_USERS_TASK_INTERVAL = 60000, UPDATE_USERS_ENDPOINT = 'https://dummyapi.online/api/users' } = process.env;

/** Fetches a list of users and upserts them into the users collection.
 * @returns {Boolean} True on success, false on failure.
 */
async function updateUsers() {
  try {
    const users = await fetch(UPDATE_USERS_ENDPOINT).then((response) => response.json());
    const updates = users.map((user) => ({
      updateOne: { filter: { id: user?.id }, update: { $set: user }, upsert: true },
    }));
    await User.bulkWrite(updates);
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
}

/** A Task that updates users. */
const updateUsersTask = new Task(updateUsers, UPDATE_USERS_TASK_INTERVAL);
export default updateUsersTask;
