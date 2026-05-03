const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
    trim: true,
  },
  profession: {
    type: String,
    default: "",
    trim: true,
  },
  organization: {
    type: String,
    default: "",
    trim: true,
  },
});

module.exports = mongoose.model("User", userSchema);
