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

//// TICKET 6 ////

exports.fetchReviewComments = (review_id) => {
  let newNum = parseInt(review_id);
  if (Number.isNaN(newNum)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request`,
    });
  }
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [review_id]
    )
    .then(({ rows }) => {
      // if (rows.length === 0) {
      //   return Promise.reject({
      //     status: 404,
      //     msg: `Not found`,
      //   });
      // }
      return rows;
    });
};

//// TICKET 7 ////

//// Make query to table to see if username/id exists in table first

exports.insertComment = (id, author, body) => {
  let newNum = parseInt(id);
  if (author === undefined || body === undefined) {
    return Promise.reject({
      status: 404,
      msg: `Not found`,
    });
  } else if (Number.isNaN(newNum)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request`,
    });
  }
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows[0] === undefined || rows[0].owner !== author) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      let queryStr =
        "INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING *;";
      let queryVal = [body, id, author];
      return db.query(queryStr, queryVal).then(({ rows }) => {
        return rows[0];
      });
    });
};

//// TICKET 8 ////

exports.fetchUpdatedReview = (id, votes) => {
  let newNum = parseInt(id);
  if (Number.isNaN(newNum) || votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: `Bad request`,
    });
  }
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows[0] === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      let queryStr =
        "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;";
      let queryVal = [votes, id];
      return db.query(queryStr, queryVal).then(({ rows }) => {
        return rows[0];
      });
    });
};

//// TICKET 9 ////
exports.fetchCommentToDelete = (id) => {
  let newNum = parseInt(id);
  if (Number.isNaN(newNum)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request`,
    });
  }
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows[0] === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      return db
        .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

////Ticket 10////
exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};
