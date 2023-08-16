const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
require("dotenv").config();
const createJWT = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.LIFE_TIME,
  });

  return token;
};
const isValidToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const attachCookiesToResponse = async ({ res, user, refreshToken }) => {
  const accessTokenJWT = await createJWT(user);
  const refreshTokenJWT = await createJWT({ user, refreshToken });

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 1000,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { createJWT, isValidToken, attachCookiesToResponse };
