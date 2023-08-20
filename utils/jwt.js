const jwt = require("jsonwebtoken");

const isTokenValid = (token) => jwt.verify(token, process.env.ACCESSTOKEN);

const createAccessToken = (userId) => {
  return jwt.sign(userId, process.env.ACCESSTOKEN, { expiresIn: "15m" });
};

const createRefreshToken = (userId) => {
  return jwt.sign(userId, process.env.REFRESHTOKEN, { expiresIn: "15m" });
};

const sendAccessToken = (res, user) => {
  res.status(200).json(user);
};

const sendRefreshToken = (res, token) => {
  res.cookie("refreshtoken", token, {
    httpOnly: true,
    path: "/refreshtoken",
  });
};

const createTokenUser = (user) => {
  return {
    username: user.rows[0].user_name,
    email: user.rows[0].email,
    img: user.rows[0].image,
    role: user.rows[0].role,
  };
};

module.exports = {
  isTokenValid,
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  createTokenUser,
};
