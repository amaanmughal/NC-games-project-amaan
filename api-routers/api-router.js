const { fetchCategories } = require("../models/model");
const express = require("express");
const cors = require("cors");

const apiRouter = require("express").Router();
const reviewRouter = require("./reviews-router");
const commentRouter = require("./comments-router");
const userRouter = require("./users-router");

const fs = require("fs/promises");

apiRouter.use(express.json());
apiRouter.use(cors());

apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);

apiRouter.get("/", (req, res, next) => {
  return fs.readFile("endpoints.json", "utf-8").then((result) => {
    res.status(200).send({ endpoint: result });
  });
});

apiRouter.get("/categories", (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories: categories });
  });
});

module.exports = apiRouter;
