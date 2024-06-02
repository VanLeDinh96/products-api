const userService = require("../services/user.service");

const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const user = await userService.createUser({
      username,
      email,
      password,
      roles,
    });
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getUsers = async (_, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createUser,
  getUsers,
};
