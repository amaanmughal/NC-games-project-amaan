const express = require("express");
const {
  getCategories,
  getEndpoints,
  getReviewId,
  getReviewArray,
  getReviewComments,
  requestComment,
  patchUpdatedReview,
  deleteComment,
  getUsers,
} = require("./controllers/controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api", getEndpoints);

app.get("/api/reviews/:review_id", getReviewId);

app.get("/api/reviews", getReviewArray);

app.get("/api/reviews/:review_id/comments", getReviewComments);

//// Ticket 7 ////
app.post("/api/reviews/:review_id/comments", requestComment);

//// Ticket 8 ////
app.patch("/api/reviews/:review_id", patchUpdatedReview);

//// Ticket 9 ////
app.delete("/api/comments/:comment_id", deleteComment);

//// TICKET 10 ////
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  // console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

module.exports = app;
