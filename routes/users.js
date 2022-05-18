const express = require('express');

const users = express.Router();

const {
  userUpdateValidation,
  avatarUpdateValidation,
  userIdValidation,
  paramsUserByIdValidation,
} = require('../validator/validator');
const {
  getUsers, getUserByID, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/me', userIdValidation, getCurrentUser);
users.get('/users/:userId', paramsUserByIdValidation, getUserByID);
users.patch('/users/me', userUpdateValidation, updateUser);
users.patch('/users/me/avatar', avatarUpdateValidation, updateAvatar);

module.exports = {
  users,
};
