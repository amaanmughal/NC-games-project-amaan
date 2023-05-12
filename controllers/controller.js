const {
  fetchCategories,
  fetchReviewId,
  fetchReviewArray,
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

exports.getReviewId = (req, res, next) => {
  let { review_id } = req.params;
  fetchReviewId(review_id)
    .then((data) => {
      res.status(200).send({ review: data });
    })
    .catch((err) => next(err));
};

exports.getReviewArray = (req, res, next) => {
  fetchReviewArray().then((data) => {
    res.status(200).send({ reviews: data });
  });
};
