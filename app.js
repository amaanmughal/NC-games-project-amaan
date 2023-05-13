const express = require("express");
const {
  getCategories,
  getEndpoints,
  getReviewId,
  getReviewArray,
} = require("./controllers/controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api", getEndpoints);

app.get("/api/reviews/:review_id", getReviewId);

app.get("/api/reviews", getReviewArray);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

module.exports = app;
