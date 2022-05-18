const jwt = require('jsonwebtoken');

const JWT_SECRET = 'some-secret-key';
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
    // .status(401)
    // .send({ message: 'Необходима авторизация' });
  }

  const token = await authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.userId = jwt.decode(token).id;
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  console.log(payload);
  console.log(req.userId);
  console.log('auth');

  next(); // пропускаем запрос дальше
};
