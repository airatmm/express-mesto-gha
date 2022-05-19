const bcrypt = require('bcrypt');

const User = require('../models/user');
const { getToken } = require('../utils/jwt');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
const DUPLICATE_MONGOOSE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUserByID = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    // .orFail(() => new NotFoundError
    // ('Пользователь по заданному id отсутствует в базе(getUserByID)'));
    if (!user) {
      next(new NotFoundError('Пользователь по заданному id отсутствует в базе getUserByID'));
      return;
      //    // res.status(404).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      //    // return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные getUserByID'));
      return;
    }
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    console.log(user);
    // .orFail(() => new NotFoundError('Пользователь по заданному id отсутствует в базе'));
    if (!user) {
      next(new NotFoundError('Пользователь по заданному id отсутствует в базе getCurrentUser'));
      return;
    //   res.status(404).send({ message: 'Пользователь по заданному id отсутствует в базе' });
    //   return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные getCurrentUser'));
      return;
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    // res.status(400).send({ message: 'Неправильные логин или пароль (!email || !password) ' });

    next(new BadRequestError('Неправильные логин или пароль (!email || !password) createUser'));
    return;
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      name, about, avatar, email, password: hash,
    });
    const savedUser = await user.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка. Поля должны быть заполнены createUser'));
      return;
    }
    if (err.code === DUPLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictError('Пользователь уже существует (DUPLICATE_MONGOOSE_ERROR_CODE)'));
      // res.status(409).send({
      //   message: `Произошла ошибка. Пользователь уже существует: ${err.message}`,
      // });
      return;
    }
    console.log(err);
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Неправильные логин или пароль login (!email || !password)'));
    return;
  }
  try {
    const user = await User.findUserByCredentials(email, password);
    console.log(user);
    // if (!user) {
    //   next(new UnauthorizedError('Неправильные логин или пароль if (!user)'));
    //   //res.status(401).send({ message: 'Неправильные логин или пароль' });
    //   return;
    // }
    const token = await getToken(user._id);
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });
    console.log(token);
    console.log(user._id);
    console.log(req.cookies.jwt);
    // .send({ message: 'Успешная авторизация' });
    res.status(200).send({ token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Поля должны быть заполнены ValidationError login'));
      return;
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Поля должны быть заполнены \'ValidationError\' updateUser'));
      // res.status(400).send({
      //   message: `Произошла ошибка. Поля должны быть заполнены: ${err.message}`,
      // });
      return;
    }
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Поля должны быть заполнены \'ValidationError\' updateAvatar'));
      // res.status(400).send({
      //   message: `Произошла ошибка. Поля должны быть заполнены: ${err.message}`,
      // });
      return;
    }
    /// /// ??????????????
    // if (err.name === 'CastError') {
    //   res.status(404).send({
    //     message: `Неверный формат id ${err.name} - ${err.message} (Нет юзера с таким id)`,
    //   });
    //   return;
    // }
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
