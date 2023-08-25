const { fetchUsers } = require("../models/model");

const userRouter = require("express").Router();

userRouter.route("/").get((req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
});

module.exports = userRouter;
