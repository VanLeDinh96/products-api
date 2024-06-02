const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/user.model.js");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).populate('roles').then((user) => {
    const roles = user.roles.map(role => role.name);
    if (roles.includes('admin')) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Admin Role!",
    });
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).populate('roles').then((user) => {
    const roles = user.roles.map(role => role.name);
    if (roles.includes('moderator')) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Moderator Role!",
    });
  });
};

const isModeratorOrAdmin = (req, res, next) => {
  User.findById(req.userId).populate('roles').then((user) => {
    const roles = user.roles.map(role => role.name);
    if (roles.includes('moderator') || roles.includes('admin')) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Moderator or Admin Role!",
    });
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
