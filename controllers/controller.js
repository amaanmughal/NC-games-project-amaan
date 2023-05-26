const {
  fetchCategories,
  fetchReviewId,
  fetchReviewArray,
  fetchReviewComments,
  insertComment,
  fetchUpdatedReview,
  fetchComments,
} = require("../models/model");
const fs = require("fs/promises");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories: categories });
  });
};

exports.getEndpoints = (req, res, next) => {
  return fs.readFile("endpoints.json", "utf-8").then((result) => {
    res.status(200).send({ endpoint: result });
  });
};

//// TICKET 4 ////

exports.getReviewId = (req, res, next) => {
  let { review_id } = req.params;
  fetchReviewId(review_id)
    .then((data) => {
      res.status(200).send({ review: data });
    })
    .catch((err) => next(err));
};

//// TICKET 5 ////

exports.getReviewArray = (req, res) => {
  fetchReviewArray().then((data) => {
    res.status(200).send({ reviews: data });
  });
};

//// TICKET 6 ////

exports.getReviewComments = (req, res, next) => {
  let { review_id } = req.params;
  fetchReviewComments(review_id)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => next(err));
};

//// TICKET 7 ////

exports.requestComment = (req, res, next) => {
  let { review_id } = req.params;
  let { username } = req.body;
  let { body } = req.body;
  insertComment(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => next(err));
};

//// TICKET 8 ////

exports.patchUpdatedReview = (req, res, next) => {
  let { review_id } = req.params;
  let { inc_votes } = req.body;
  fetchUpdatedReview(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => next(err));
};

//// ticket 9 ////
exports.deleteComment = (req, res, next) => {};
