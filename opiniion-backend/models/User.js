/************************************
 * User document model              *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import mongoose from 'mongoose';

const modelName = 'User';
const collectionName = 'users';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipcode: String,
});

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    min: 1,
  },
  name: String,
  username: String,
  email: String,
  address: addressSchema,
});

const User = mongoose.model(modelName, userSchema, collectionName);
export default User;
