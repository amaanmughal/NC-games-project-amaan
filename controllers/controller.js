const { fetchCategories, fetchEndpoints } = require("../models/model");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories: categories });
  });
};

exports.getEndpoints = (req, res) => {
  fetchEndpoints().then((data) => {
    res.status(200).send({ data: data });
  });
};
