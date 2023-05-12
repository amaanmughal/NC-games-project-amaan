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

app.get("/api/review/:review_id", getReviewId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.get("/api/review", getReviewArray);

module.exports = app;
