const { fetchCategories } = require("../models/model");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    console.log(categories);
    res.status(200).send({ categories: categories });
  });
};
