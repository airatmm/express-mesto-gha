const { celebrate, Joi } = require('celebrate');

// USERS
// post /signup createUser
const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// post /signin login
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// path /users/me updateUser
const userUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

// path /users/me/avatar updateAvatar
// avatar: Joi.string().regex(/(http|https):\/\/(www)?\.?([A-Za-z0-9.-]+)\.([A-z]{2,})
// ((?:\/[+~%/.\w-_]*)?\??(?:[-=&;%@.\w_]*)#?(?:[\w]*))?/)
// .required(),
const avatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});

// get /users/me getCurrentUser
const userIdValidation = celebrate({
  body: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

// CARDS
// post /cards createCards
const cardsValidation = celebrate({
  body: Joi.object().keys({
    link: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

// GENERAL
// get /users/:userId getUserByID
// delete /cards/:cardId deleteCard
// delete /cards/:cardId/likes dislikeCard
// put /cards/:cardId/likes likeCard
const paramsByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  userValidation,
  loginValidation,
  userUpdateValidation,
  avatarUpdateValidation,
  cardsValidation,
  userIdValidation,
  paramsByIdValidation,
};
