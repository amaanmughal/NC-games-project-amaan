const express = require("express");
const {
  getCategories,
  getEndpoints,
  getReviewId,
} = require("./controllers/controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api", getEndpoints);

app.get("/api/review/:review_id", getReviewId);

app.use((err, req, res, next) => {
  res.status(404).send("review id does not exist");
});

module.exports = app;
