/************************************
 * v1 API router                    *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/
import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';
import User from '../models/User.js';

const router = Router();
const userProjection = { _id: false, __v: false, 'address._id': false };

const addressValidationSchema = {
  street: Joi.string().min(1),
  city: Joi.string().min(1),
  state: Joi.string().length(2).uppercase(),
  zipcode: Joi.string().min(5),
};

const userValidationSchema = {
  id: Joi.number().min(1),
  name: Joi.string().min(1),
  username: Joi.string().min(1),
  email: Joi.string().min(1),
  address: Joi.object(addressValidationSchema).options({ stripUnknown: true }),
};

/**
@method Get
@route /userById
@param {Int} userId
@return {User} the user with the id that matches the userId param
*/
router.get(
  '/userById/:userId',
  celebrate({
    params: Joi.object({ userId: userValidationSchema.id.required() }).required(),
  }),
  async (req, res, next) => {
    const { userId: id } = req.params;
    const result = await User.findOne({ id }, userProjection);
    if (!result) return next(); // Continue to custom 404 Not Found responder
    return res.json(result);
  }
);

/**
@method POST
@route /getUserByState
@param {String} stateCode
@return {Array<User>} users with the state matching the stateCode param
*/
router.post(
  '/getUserByState',
  celebrate({
    body: Joi.object({ stateCode: addressValidationSchema.state.required() }).required(),
  }),
  async (req, res) => {
    const { stateCode } = req.body;
    const result = await User.find({ 'address.state': stateCode }, userProjection);
    return res.json(result);
  }
);

/**
@method POST
@route /countByState
@return {Array<String, Int>} all existing states with the number of users within them
*/
router.post('/countByState', async (req, res) => {
  const result = await User.aggregate([{ $group: { _id: '$address.state', count: { $sum: 1 } } }]).project({
    _id: false,
    stateCode: '$_id',
    count: true,
    sum: true,
  });
  return res.json(result);
});

/**
@method POST
@route /userGroupByState
@return {Array<String, {Array<User>}>} all existing states with the complete user objects within them
*/
router.post('/userGroupByState', async (req, res) => {
  const result = await User.aggregate([{ $group: { _id: '$address.state', users: { $push: '$$ROOT' } } }])
    .project({
      _id: false,
      stateCode: '$_id',
      users: true,
    })
    .project({ users: userProjection });
  return res.json(result);
});

/**
@method POST
@route /searchUsers
@param {String} searchParam
@return {Array<User>} users with any field matching searchParam
*/
router.post(
  '/searchUsers',
  celebrate({
    body: Joi.object({ searchParam: Joi.string().required().min(1) }).required(),
  }),
  async (req, res) => {
    const { searchParam } = req.body;
    const results = await User.find({ $text: { $search: searchParam } }, userProjection);
    return res.json(results);
  }
);

/**
@method POST
@route /updateUser
@param {Int} userId
@param {Dict} fieldsToUpdate
@return {User} updated user object matching userId
*/
router.post(
  '/updateUser',
  celebrate({
    body: Joi.object({
      userId: userValidationSchema.id.required(),
      fieldsToUpdate: Joi.object(userValidationSchema).options({ stripUnknown: true }).required(),
    }).required(),
  }),
  async (req, res, next) => {
    const { userId: id, fieldsToUpdate } = req.body;
    const result = await User.findOneAndUpdate({ id }, fieldsToUpdate, {
      projection: userProjection,
      returnDocument: 'after',
      upsert: false,
    });
    if (!result) return next(); // Continue to custom 404 Not Found responder
    return res.json(result);
  }
);

export default router;
