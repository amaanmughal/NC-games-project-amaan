const { fetchUsers, fetchUsername, postUser } = require("../models/model");

const userRouter = require("express").Router();

userRouter
  .route("/")
  .get((req, res) => {
    fetchUsers().then((users) => {
      res.status(200).send({ users: users });
    });
  })
  .post((req, res, next) => {
    const { username, name, avatar_url } = req.body;

    postUser(username, name, avatar_url)
      .then((user) => {
        res.status(201).send({ user: user });
      })
      .catch((err) => next(err));
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
