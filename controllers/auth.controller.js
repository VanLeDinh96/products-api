const userService = require('../services/user.service');

const signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const response = await userService.signup({
      username,
      email,
      password,
      roles,
    });
    res.status(201).send(response);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await userService.signin({ username, password });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  signup,
  signin,
};
