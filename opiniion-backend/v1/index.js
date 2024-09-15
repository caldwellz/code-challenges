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

/**
@method Get
@route /userById
@param {Int} userId
@return {User} the user with the id that matches the userId param
*/
router.get('/userById/:userId', async (req, res) => {
  return res.json();
});

/**
@method POST
@route /getUserByState
@param {String} stateCode
@return {Array<User>} users with the state matching the stateCode param
*/
router.post(
  '/getUserByState',
  celebrate({
    body: Joi.object({ stateCode: Joi.string().required().length(2).uppercase() }).required(),
  }),
  async (req, res) => {
    const { stateCode } = req.body;
    const result = await User.find({ 'address.state': stateCode });
    return res.json(result);
  }
);

/**
@method POST
@route /countByState
@return {Array<String, Int>} all existing states with the number of users within them
*/
router.post('/countByState', async (req, res) => {
  return res.json();
});

/**
@method POST
@route /userGroupByState
@return {Array<String, {Array<User>}>} all existing states with the complete user objects within them
*/
router.post('/userGroupByState', async (req, res) => {
  return res.json();
});

/**
@method POST
@route /searchUsers
@param {String} searchParam
@return {Array<User>} users with any field matching searchParam
*/
router.post('/searchUsers', async (req, res) => {
  return res.json();
});

/**
@method POST
@route /updateUser
@param {Int} userId
@param {Dict} fieldsToUpdate
@return {User} updated user object matching userId
*/
router.post('/updateUser', async (req, res) => {
  return res.json();
});

export default router;
