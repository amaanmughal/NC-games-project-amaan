const { fetchUsers, fetchUsername } = require("../models/model");

const userRouter = require("express").Router();

userRouter.route("/").get((req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
});

userRouter.route("/:username").get((req, res, next) => {
  let { username } = req.params;

  fetchUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => next(err));
});

module.exports = userRouter;
