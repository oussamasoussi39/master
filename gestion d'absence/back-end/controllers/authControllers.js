const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const createHash = require("../utils/createHash");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  unauthenticatedError,
  unauthorizedError,
  NotFoundError,
} = require("../errors");
const crypto = require("crypto");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
} = require("../utils");
const Token = require("../models/Token");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const { valid } = require("joi");

const register = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  const userAlreadyExist = await User.findOne({ email });
  if (userAlreadyExist) {
    throw new BadRequestError("email has already existed");
  }
  const role = (await User.countDocuments({})) === 0 ? "SuperAdmin" : "Agent";
  const verificationToken = crypto.randomBytes(40).toString("hex");
  // const user=await new User({email,firstName,lastName,password,phoneNumber,role})
  const user = await User.create({ ...req.body, role, verificationToken });
  if (role === "SuperAdmin") {
    user.isAuth = true;
  }
  await user.save();
  // let message = "request is pending please wait for admin";
  // if (user.isAuth) {
  //   message = "user created";
  // }
  // const tokenUser = createTokenUser(user);
  // console.log(tokenUser);
  // //   const token = await jwt.sign(tokenUser, process.env.JWT_SECRET, {
  // //     expiresIn: process.env.LIFE_TIME,
  // //   });
  // //
  console.log(email);
  console.log(user.verificationToken);
  await sendVerificationEmail({
    name: `${firstName} ${lastName}`,
    email: email,
    verificationToken: user.verificationToken,
    origin: "http://localhost:3000/",
  });
  // await attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({
    // user: tokenUser,
    ...(user.isAuth
      ? { message: "user created" }
      : { message: "request is pending please wait for admin" }),
    verificationToken: user.verificationToken,
  });
};
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new unauthenticatedError("verification failed ");
  }
  if (verificationToken !== user.verificationToken) {
    throw new unauthenticatedError("verification failed");
  }
  user.isVerified = true;
  user.verificationToken = "";
  user.verified = Date.now();
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "email is verified" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  console.log(email, password, user);

  if (!user) {
    throw new unauthenticatedError("Invalid Credentials");
  }

  // const isPasswordValid = await user.comparePassword(password);
  const isPasswordValid = user.comparePassword(password);

   const Valid= await bcrypt.compare("password","password")
console.log(Valid);
  if (!isPasswordValid) {
    throw new unauthenticatedError("Invalid Credentials");
  }
  if (!user.isVerified) {
    throw new unauthenticatedError("Invalid Credentials");
  }
  // if (!user.isAuth) {
  //   throw new unauthorizedError("unauthorized to access");
  // }
  const tokenUser = createTokenUser(user);
  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new unauthenticatedError("invalid credential");
    }
    refreshToken = existingToken.refreshToken;

    const userToken = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      refreshToken,
      user: user._id,
    };

    console.log(userToken, "ref");
    await attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res.status(StatusCodes.OK).json({ user: userToken });
  }

  refreshToken = crypto.randomBytes(40).toString();

  const userToken = {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    refreshToken,
    user: user._id,
  };
  await Token.create(userToken);
  await attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: userToken });
};
const logout = async (req, res) => {
  console.log(req.user);
  await Token.findOneAndDelete({ user: req.user.id });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    // maxAge: 1000,
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  return res.status(StatusCodes.OK).json({ message: "logout" });
};
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("please provide email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("invalid email");
  }
  const tokenPassword = crypto.randomBytes(40).toString("hex");
  await sendResetPasswordEmail({
    name: ` ${user.firstName} ${user.lastName}`,
    email: user.email,
    token: tokenPassword,
    origin: "http://localhost:3000/",
  });

  user.passwordToken = createHash(tokenPassword);
  user.passwordTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 60 * 10);
  await user.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: "please check your email for reset password link" });
};
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!email || !token || !password) {
    throw new BadRequestError("please provide values");
  }
  const user = await User.findOne({ email });
  if (user) {
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > new Date()
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  console.log(user.password);
  return res.status(StatusCodes.OK).json({ message: "resetpassword" });
};
module.exports = {
  logout,
  register,
  login,
  verifyEmail,
  resetPassword,
  forgetPassword,
};
