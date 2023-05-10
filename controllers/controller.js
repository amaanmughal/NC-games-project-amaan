const { fetchCategories } = require("../models/model");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories: categories });
  });
};
