const { fetchCommentToDelete } = require("../models/model");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete((req, res, next) => {
  let { comment_id } = req.params;
  fetchCommentToDelete(comment_id)
    .then(() => {
      res.status(204).send({ msg: "No content" });
    })
    .catch((err) => next(err));
});

module.exports = commentRouter;
