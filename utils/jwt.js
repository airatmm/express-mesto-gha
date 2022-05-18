const jwt = require('jsonwebtoken');

const JWT_SECRET = 'some-secret-key';

const getToken = async (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

module.exports = { getToken };
