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
    .query(`ALTER TABLE reviews DROP COLUMN IF EXISTS review_body;`)
    .then(() => {
      return db
        .query(`SELECT * FROM reviews ORDER BY created_at DESC`)
        .then((res) => {
          let alteredReviews = res.rows;
          return db
            .query(
              "SELECT reviews.review_id, comments.body FROM reviews JOIN comments ON reviews.review_id = comments.review_id"
            )
            .then((res) => {
              let commentsArr = res.rows;
              for (let i = 0; i < alteredReviews.length; i++) {
                alteredReviews[i].comment_count = [];
                for (let j = 0; j < commentsArr.length; j++) {
                  if (
                    commentsArr[j].review_id === alteredReviews[i].review_id
                  ) {
                    alteredReviews[i].comment_count.push(commentsArr[j].body);
                  }
                }
                alteredReviews[i].comment_count =
                  alteredReviews[i].comment_count.length;
              }
              return alteredReviews;
            });
        });
    });
};
