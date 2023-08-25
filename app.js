const express = require("express");

const apiRouter = require("./api-routers/api-router");

const cors = require("cors");
const app = express();

app.use("/api", apiRouter);
app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
  // console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

module.exports = app;
