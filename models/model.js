const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};

exports.fetchReviewId = (review_id) => {
  let newNum = parseInt(review_id);
  if (Number.isNaN(newNum)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request`,
    });
  }
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      return rows[0];
    });
};
