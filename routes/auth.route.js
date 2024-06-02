const express = require("express");
const { signup, signin } = require("../controllers/auth.controller");
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} = require("../middlewares/verify-sign-up");

const router = express.Router();

router.post(
  "/signup",
  [checkDuplicateUsernameOrEmail, checkRolesExisted],
  signup
);
router.post("/signin", signin);

module.exports = router;
