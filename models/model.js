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

exports.fetchReviewArray = () => {
  return db
    .query(
      "SELECT reviews.review_id, comments.body FROM reviews JOIN comments ON reviews.review_id = comments.review_id ORDER BY comments.review_id ASC"
    )
    .then((res) => {
      let commentsArr = res.rows;

      return db
        .query("SELECT * FROM reviews ORDER BY created_at DESC")
        .then((res) => {
          let reviewsArrOne = res.rows;
          for (let i = 0; i < reviewsArrOne.length; i++) {
            reviewsArrOne[i].comment_count = [];
          }
          return reviewsArrOne;
        })
        .then((res) => {
          let reviewsArr = res;
          for (let i = 0; i < reviewsArr.length; i++) {
            for (let j = 0; j < commentsArr.length; j++) {
              if (commentsArr[j].review_id === reviewsArr[i].review_id) {
                reviewsArr[i].comment_count.push(commentsArr[j].body);
              }
            }
          }
          return reviewsArr;
        })
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            res[i].comment_count = res[i].comment_count.length;
            delete res[i].review_body;
          }
          return res;
        });
    });
};
