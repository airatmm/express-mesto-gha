const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({message: `На сервере произошла ошибка: ${err.message}`})
  }
};

const getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({message: `На сервере произошла ошибка: ${err.message}`})
  }
}

const createUser = async (req, res) => {
  try {
    const {name, about, avatar} = req.body;
    const user = new User({name, about, avatar});
    res.status(201).send(await user.save());
  } catch (err) {
    res.status(500).send({message: `На сервере произошла ошибка: ${err.message}`})
  }
}

const updateUser = async (req, res) => {
  try {
    const {name, about} = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, {name, about}, {new: true});
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({message: `На сервере произошла ошибка: ${err.message}`})
  }
}

const updateAvatar = async (req, res, next) => {
  try {
  const {avatar} = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, {avatar}, {new: true});
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({message: `На сервере произошла ошибка: ${err.message}`})
  }
}

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar
}