const UsersService = require("./usersService");

async function createUser(req, res, next) {
  // TODO: change to responder
  return res.json({ message: "User created" });
}

async function getUser(req, res, next) {
  const userId = req.params.id;

  const user = await UsersService.getUser(userId);

  return res.json({
    user
  });
}

async function getUsers(req, res, next) {
  const query = req.body.query || {};
  const users = await UsersService.getUsers(query);

  return res.json({
    users
  });
}

async function updateUser(req, res, next) {
  const userId = req.params.id;
  const { userInfo } = req.body;

  const resultUpdate = await UsersService.updateUser({
    userId,
    userInfo
  });

  return res.json({
    message: resultUpdate
  });
}

async function deleteUser(req, res, next) {
  const resultDelete = await UsersService.deleteUser(req.user._id);

  return res.json({
    message: resultDelete
  });
}

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
};
