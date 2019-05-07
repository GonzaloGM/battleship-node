const mongoose = require("mongoose");
const _ = require("lodash");

const { NotFoundError } = require("../helpers/error.helper");

const UserModel = mongoose.model("User");

async function deleteUser(userId) {
  const user = await UserModel.findOne({
    _id: userId
  });
  if (!user) {
    throw new NotFoundError({ message: `User not found` });
  }
  await user.remove();
  return `User deleted`;
}

async function getUser(userId) {
  const user = await UserModel.findOne({
    _id: userId
  });
  if (!user) {
    throw new NotFoundError({ message: `User not found` });
  }
  return user;
}

async function getUsers(query) {
  const users = await UserModel.find(query);
  if (_.isEmpty(users)) {
    throw new NotFoundError({ message: `Users not found` });
  }
  return users;
}

async function updateUser({ userId, userInfo }) {
  let user = await UserModel.findOne({
    _id: userId
  });

  if (!user) {
    throw new NotFoundError({ message: `User not found` });
  }

  user = Object.assign(user, userInfo);

  await user.save();

  return `User updated`;
}

module.exports = {
  deleteUser,
  updateUser,
  getUser,
  getUsers
};
