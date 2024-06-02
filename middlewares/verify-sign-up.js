const User = require("../models/user.model");
const Role = require("../models/role.model");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userWithUsername = await User.findOne({
      username: req.body.username,
    });
    if (userWithUsername) {
      return res.status(400).send({
        message: "Failed! Username is already in use!",
      });
    }

    const userWithEmail = await User.findOne({ email: req.body.email });
    if (userWithEmail) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const checkRolesExisted = async (req, res, next) => {
  if (req.body.roles) {
    try {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      const roleNames = roles.map((role) => role.name);

      for (let i = 0; i < req.body.roles.length; i++) {
        if (!roleNames.includes(req.body.roles[i])) {
          return res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i],
          });
        }
      }

      next();
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  } else {
    next();
  }
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
