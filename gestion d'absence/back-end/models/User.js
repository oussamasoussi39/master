const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 20,
    required: [true, "Please provide firstName "],
  },
  lastName: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 20,
    required: [true, "Please provide lastName "],
  },
  phoneNumber: {
    type: Number,
    minLength: 8,
    unique: true,
    required: [true, "please Provide phoneNumber"],
  },
  address: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "please provide valid email",
    },
  },
  password: {
    type: String,
    minLength: 6,
    required: [true, "Please provide password"],

  },
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin", "Agent"],
    default: "Agent",
  },
  isAuth: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});
UserSchema.pre("save", async function (next) {
  const saltRounds = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, saltRounds);

  next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
  
  return  bcrypt.compare(candidatePassword,this.password)
};

module.exports = mongoose.model("User", UserSchema);
