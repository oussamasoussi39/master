const { unauthenticatedError } = require("../errors");
const Token = require("../models/Token");
const { isValidToken, attachCookiesToResponse } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = isValidToken(accessToken);
      req.user = payload.user;
      console.log(payload);
      return next();
    }
    const payload = isValidToken(refreshToken);
    console.log(payload.user.id, payload.refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.id,
      refreshToken: payload.refreshToken,
    });
    console.log(existingToken,"existingtoken");
    if (!existingToken || !existingToken?.isValid) {
      throw new unauthenticatedError("Authentication invalid");
    }
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (err) {
    throw new unauthenticatedError("Authentication invalid");
  }
};
module.exports = authenticateUser;
