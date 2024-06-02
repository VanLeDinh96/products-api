const User = require("../models/user.model");
const Role = require("../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const signup = async ({ username, email, password, roles }) => {
  try {
    const newUser = new User({
      username,
      email,
      password,
    });

    if (roles) {
      const roleInstances = await Role.find({ name: { $in: roles } });
      newUser.roles = roleInstances.map((role) => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      newUser.roles = [defaultRole._id];
    }

    await newUser.save();
    return { message: "User registered successfully!" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const signin = async ({ username, password }) => {
  try {
    const user = await User.findOne({ username }).populate("roles");

    if (!user) {
      throw new Error("User Not found.");
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      throw new Error("Invalid Password!");
    }

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400,
    });

    // Get user roles
    const authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const createUser = async ({ username, email, password, roles }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    if (roles) {
      const roleInstances = await Role.find({ name: { $in: roles } });
      newUser.roles = roleInstances.map((role) => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      newUser.roles = [defaultRole._id];
    }

    await newUser.save();
    return newUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUsers = async () => {
  try {
    const users = await User.find().populate("roles");
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  signup,
  signin,
  createUser,
  getUsers,
};
