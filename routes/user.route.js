const express = require("express");
const { createUser, getUsers } = require("../controllers/user.controller");
const {
  isAdmin,
  isModeratorOrAdmin,
  verifyToken,
} = require("../middlewares/auth.jwt");

const router = express.Router();

router.post("/", [verifyToken, isAdmin], createUser);
router.get("/", [verifyToken, isModeratorOrAdmin], getUsers);

module.exports = router;
