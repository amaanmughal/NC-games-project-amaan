const { fetchCategories } = require("../models/model");
const fs = require("fs/promises");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories: categories });
  });
};

exports.getEndpoints = (req, res) => {
  return fs.readFile("endpoints.json", "utf-8").then((result) => {
    res.status(200).send({ endpoint: result });
  });
};
