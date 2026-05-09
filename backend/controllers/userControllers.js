const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { toTitleCase } = require("../utils/titleCase");

const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const record = await User.findOne({
    email: String(email || "").trim().toLowerCase(),
  });

  if (record) {
    return res.status(400).send("User already registered");
  }
  const user = new User({
    name: toTitleCase(String(name || "")),
    username: String(username || "").trim(),
    email: String(email || "").trim().toLowerCase(),
    password: hashedPassword,
  });

  const result = await user.save();

  const { _id } = await result.toJSON();

  const token = jwt.sign({ _id: _id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const { password: _pw, ...safe } = result.toJSON();
  return res.json(safe);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });

  if (!user) {
    return res.status(404).send("User not found!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send("Invalid credentials");
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({
    message: "Login Successful",
    user: {
      id: user._id,
      name: toTitleCase(user.name || ""),
      email: user.email,
    },
  });
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req._id });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const { password, ...data } = user.toJSON();
  data.name = toTitleCase(data.name || "");

  return res.send(data);
};

const logoutUser = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    path: "/",
  });
  return res.json({ message: "Logged out" });
};

const updateProfile = async (req, res) => {
  try {
    const { name, address, profession, organization } = req.body;

    const user = await User.findOne({ _id: req._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined && name !== null) {
      user.name = toTitleCase(String(name));
    }
    if (address !== undefined && address !== null) {
      user.address = String(address).trim();
    }
    if (profession !== undefined && profession !== null) {
      user.profession = String(profession).trim();
    }
    if (organization !== undefined && organization !== null) {
      user.organization = String(organization).trim();
    }

    await user.save();

    const { password, ...data } = user.toJSON();
    data.name = toTitleCase(data.name || "");

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update profile." });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getUser, updateProfile };
