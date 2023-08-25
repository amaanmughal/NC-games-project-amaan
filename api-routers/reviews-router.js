const {
  fetchReviewArray,
  fetchReviewId,
  fetchReviewComments,
  insertComment,
  fetchUpdatedReview,
} = require("../models/model");

const reviewRouter = require("express").Router();

reviewRouter.get("/", (req, res, next) => {
  const { sort_by, category, order } = req.query;
  fetchReviewArray(sort_by, category, order)
    .then((data) => {
      res.status(200).send({ reviews: data });
    })
    .catch((err) => {
      next(err);
    });
});

reviewRouter
  .route("/:review_id")
  .get((req, res, next) => {
    let { review_id } = req.params;
    fetchReviewId(review_id)
      .then((data) => {
        res.status(200).send({ review: data });
      })
      .catch((err) => next(err));
  })
  .patch((req, res, next) => {
    let { review_id } = req.params;
    let { inc_votes } = req.body;

    fetchUpdatedReview(review_id, inc_votes)
      .then((review) => {
        res.status(200).send({ review: review });
      })
      .catch((err) => next(err));
  });

reviewRouter
  .route("/:review_id/comments")
  .get((req, res, next) => {
    let { review_id } = req.params;
    fetchReviewComments(review_id)
      .then((data) => {
        res.status(200).send({ comments: data });
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;

    insertComment(review_id, username, body)
      .then((comment) => {
        res.status(201).send({ comment: comment });
      })
      .catch((err) => next(err));
  });

module.exports = reviewRouter;
