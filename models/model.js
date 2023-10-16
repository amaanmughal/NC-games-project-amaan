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

exports.fetchReviewArray = (
  sort_by = "reviews.created_at",
  category,
  order = "DESC"
) => {
  if (sort_by !== "reviews.created_at") {
    sort_by = `reviews.${sort_by}`;
  }

  const validSortQueries = [
    "reviews.created_at",
    "reviews.title",
    "reviews.votes",
  ];
  const queryValues = [];

  upperCaseOrder = order.toUpperCase();

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid sort query`,
    });
  }

  let queryStr = `SELECT reviews.review_id, reviews.title, reviews.owner, reviews.category, reviews.created_at, reviews.review_img_url, reviews.designer, COUNT(comments.comment_id) AS comment_count, reviews.votes FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`;

  if (category && category !== "all") {
    queryStr += ` WHERE reviews.category = $1`;
    queryValues.push(category);
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${upperCaseOrder};`;

  return db.query(queryStr, queryValues).then((res) => {
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
      return rows;
    });
};

//// TICKET 7 ////

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
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    let filteredUsers = rows.filter((user) => user.username === author);

    if (filteredUsers[0] === undefined) {
      return Promise.reject({
        status: 404,
        msg: `Not found`,
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
          "INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING *;";
        let queryVal = [body, id, author];
        return db.query(queryStr, queryVal).then(({ rows }) => {
          return rows[0];
        });
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

///// POST USER /////

exports.postUser = (
  username,
  name,
  avatar_url = "https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
) => {
  if (username === "" || username === undefined) {
    return Promise.reject({
      status: 404,
      msg: `Not found`,
    });
  }
  if (name === "" || name === undefined) {
    return Promise.reject({
      status: 404,
      msg: `Not found`,
    });
  }
  if (avatar_url === "") {
    avatar_url = "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";
  }
  return db
    .query(
      "INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *;",
      [username, name, avatar_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

///// TICKET 11 /////

exports.fetchUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((user) => {
      if (user.rows[0] === undefined) {
        return Promise.reject({
          status: 404,
          msg: `User not found`,
        });
      }
      return user.rows[0];
    });
};

///// TICKET 18 /////

exports.fetchCommentToChangeVote = (id, inc_votes) => {
  let newNum = parseInt(id);
  if (Number.isNaN(newNum) || inc_votes === undefined) {
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
      let queryStr =
        "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;";
      let queryVal = [inc_votes, id];
      return db.query(queryStr, queryVal).then(({ rows }) => {
        return rows[0];
      });
    });
};
