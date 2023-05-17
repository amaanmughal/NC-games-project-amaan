const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};

//// TICKET 4 ////

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

//// TICKET 5 ////

exports.fetchReviewArray = () => {
  return db
    .query(
      `SELECT reviews.review_id, reviews.title, reviews.owner, reviews.category, reviews.created_at, reviews.review_img_url, reviews.designer, COUNT(comments.comment_id) AS comment_count, reviews.votes FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC`
    )
    .then((res) => {
      return res.rows;
    });
};
