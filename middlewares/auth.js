const jwt = require('jsonwebtoken');

const JWT_SECRET = 'some-secret-key';
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = await authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.userId = jwt.decode(token).id;
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
