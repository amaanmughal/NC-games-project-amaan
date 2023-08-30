const {
  fetchCommentToDelete,
  fetchCommentToChangeVote,
} = require("../models/model");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .delete((req, res, next) => {
    let { comment_id } = req.params;
    fetchCommentToDelete(comment_id)
      .then(() => {
        res.status(204).send({ msg: "No content" });
      })
      .catch((err) => next(err));
  })
  .patch((req, res, next) => {
    let { comment_id } = req.params;
    let { inc_votes } = req.body;

    fetchCommentToChangeVote(comment_id, inc_votes)
      .then((comment) => {
        res.status(200).send({ comment: comment });
      })
      .catch((err) => next(err));
  });

module.exports = commentRouter;
