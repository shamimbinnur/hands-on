const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/config");

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire,
  });
};

module.exports = generateToken;
