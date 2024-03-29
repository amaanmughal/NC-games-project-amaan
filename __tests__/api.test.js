const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  test("status 200 - array of category objects showing slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const cats = res.body.categories;
        cats.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api", () => {
  test("status 200 - JSON describing all the available endpoints on my API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(JSON.parse(res.body.endpoint)).toEqual(endpoints);
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status 200 - client has entered valid id", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_body: "We couldn't find the werewolf!",
          review_id: 3,
          review_img_url:
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
          title: "Ultimate Werewolf",
          votes: 5,
        });
      });
  });
  test("status 404 - Not found (endpoint does not exist)", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.text)).toMatchObject({ msg: "Not found" });
      });
  });
  test("status 400 - Bad request (endpoint does not exist)", () => {
    return request(app)
      .get("/api/reviews/nonsense")
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toMatchObject({ msg: "Bad request" });
      });
  });
});

///// Ticket 5 + Ticket 11 /////

describe("GET /api/reviews", () => {
  test("status 200 - objects in Reviews Array do not have review_body", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews[0]).not.toHaveProperty("review_body");
      });
  });
  test("status 200 - sorted by created_at descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const reviewsArr = res.body.reviews;
        expect(reviewsArr).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 200 - object has the correct comment_count", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        let review = res.body.reviews;
        expect(review.length).toBe(13);
        let testReview = [];
        review.forEach((obj) => {
          if (obj.review_id === 2) {
            testReview.push(obj);
          }
        });
        expect(testReview[0].comment_count).toBe("3");
      });
  });
  test("status 200 - return results with correct query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(1);
        res.body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("status 200 - return results with correct query & sort by", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=title")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(11);
        expect(res.body.reviews[0].title).toBe("Ultimate Werewolf");
        expect(res.body.reviews[10].title).toBe(
          "A truly Quacking Game; Quacks of Quedlinburg"
        );
      });
  });
  test("status 200 - return results with correct query, sort by and order ascending", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=votes&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(11);
        expect(res.body.reviews[10].votes).toBe(100);
        expect(res.body.reviews[0].votes).toBe(5);
      });
  });
  test("status 400 - return invalid sort query message", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=nonsense")
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toMatchObject({
          msg: "Invalid sort query",
        });
      });
  });
  test("status 200 - return all categories", () => {
    return request(app)
      .get("/api/reviews?category=all")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(13);
      });
  });
});

///// TICKET 6 /////

describe("GET /api/reviews/:review_id/comments", () => {
  test("status 200 - client has entered valid id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments[0]).toMatchObject({
          comment_id: 6,
          body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
          review_id: 3,
          author: "philippaclaire9",
          votes: 10,
          created_at: "2021-03-27T19:49:48.110Z",
        });
      });
  });
  test("status 200 - sorted by created_at descending", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        const reviewsArr = res.body.comments;
        expect(reviewsArr).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 400 - Bad request (endpoint does not exist)", () => {
    return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toMatchObject({ msg: "Bad request" });
      });
  });
});

//// TICKET 7 ////

describe("POST /api/reviews/:review_id/comments", () => {
  test("post message returns username and body", () => {
    const newComment = {
      username: "mallionaire",
      body: "book was cool",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(201)
      .then((rows) => {
        let obj = rows.body.comment;
        expect(obj).toHaveProperty("comment_id");
        expect(obj).toHaveProperty("body");
        expect(obj).toHaveProperty("review_id");
        expect(obj).toHaveProperty("author");
        expect(obj).toHaveProperty("votes");
        expect(obj).toHaveProperty("created_at");
        expect(obj.body).toBe("book was cool");
      });
  });
  test("post message only returns username and body", () => {
    const newComment = {
      username: "mallionaire",
      body: "book was cool",
      votes: 25,
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(201)
      .then((rows) => {
        let obj = rows.body.comment;
        expect(obj.body).toBe("book was cool");
        expect(obj.author).toBe("mallionaire");
        expect(obj.votes).toBe(0);
      });
  });
  test("400 - review id not valid", () => {
    const newComment = {
      username: "mallionaire",
      body: "book was cool",
    };
    return request(app)
      .post("/api/reviews/nonsense/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual({
          msg: `Bad request`,
        });
      });
  });
  test("404 - missing input field body / author", () => {
    const newComment = {
      username: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual({
          msg: `Not found`,
        });
      });
  });
  test("404 - review id does not exist", () => {
    const newComment = {
      username: "mallionaire",
      body: "book was cool",
    };
    return request(app)
      .post("/api/reviews/6000/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual({
          msg: `Not found`,
        });
      });
  });
  test("404 - username does not exist", () => {
    const newComment = {
      username: "bibi",
      body: "book was cool",
    };
    return request(app)
      .post("/api/reviews/10/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual({
          msg: `Not found`,
        });
      });
  });
});

//// TICKET 8 ////

describe("PATCH /api/reviews/:review_id", () => {
  test("200 - updated review with increased votes if positive number", () => {
    const updateReviewVotes = {
      inc_votes: 12,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(updateReviewVotes)
      .expect(200)
      .then((rows) => {
        let finalRow = rows.body.review;

        expect(finalRow).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 13,
        });
      });
  });
  test("200 - updated review with decreased votes if negative number", () => {
    const updateReviewVotes = {
      inc_votes: -12,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(updateReviewVotes)
      .expect(200)
      .then((rows) => {
        let finalRow = rows.body.review;

        expect(finalRow).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: -11,
        });
      });
  });
  test("400 - invalid id", () => {
    const updateReviewVotes = {
      inc_votes: 12,
    };
    return request(app)
      .patch("/api/reviews/nonsense")
      .send(updateReviewVotes)
      .expect(400)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);
        expect(parsedRes).toEqual({
          msg: `Bad request`,
        });
      });
  });
  test("400 - incorrect body passed", () => {
    const updateReviewVotes = {
      name: "jay-jay",
    };
    return request(app)
      .patch("/api/reviews/6")
      .send(updateReviewVotes)
      .expect(400)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);
        expect(parsedRes).toEqual({
          msg: `Bad request`,
        });
      });
  });
  test("404 - non-existing id", () => {
    const updateReviewVotes = {
      inc_votes: 12,
    };
    return request(app)
      .patch("/api/reviews/6000")
      .send(updateReviewVotes)
      .expect(404)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);

        expect(parsedRes).toEqual({
          msg: `Not found`,
        });
      });
  });
});

//// TICKET 9 ////

describe("DELETE /api/comments/:comment_id", () => {
  test("204 - no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((res) => {
        let code = res.statusCode;

        expect(code).toEqual(204);
      });
  });
  test("400 - invalid id", () => {
    return request(app)
      .delete("/api/comments/nonsense")
      .expect(400)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);
        expect(parsedRes).toEqual({
          msg: `Bad request`,
        });
      });
  });
  test("404 - non-existing id", () => {
    return request(app)
      .delete("/api/comments/6000")
      .expect(404)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);

        expect(parsedRes).toEqual({
          msg: `Not found`,
        });
      });
  });
});

//// TICKET 10 ////

describe("GET /api/users", () => {
  test("status 200 - array of user objects showing username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const users = res.body.users;
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

///// TICKET 17 ////

describe("GET /api/users/:username", () => {
  test("status 200 - array of user objects showing", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then((res) => {
        const user = res.body.user;

        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("avatar_url");
      });
  });
  test("404 - non-existing id", () => {
    return request(app)
      .get("/api/users/nonsense")
      .expect(404)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);

        expect(parsedRes).toEqual({
          msg: `User not found`,
        });
      });
  });
});

/////Ticket 18 /////

describe("PATCH /api/comments/:comment_id", () => {
  test("200 - updated review with increased votes if positive number", () => {
    const updateCommentVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/6")
      .send(updateCommentVotes)
      .expect(200)
      .then((rows) => {
        let finalRow = rows.body.comment;

        expect(finalRow).toMatchObject({
          comment_id: 6,
          body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
          review_id: 3,
          author: "philippaclaire9",
          votes: 11,
          created_at: "2021-03-27T19:49:48.110Z",
        });
      });
  });
  test("200 - updated review with decreased votes if negative number", () => {
    const updateCommentVotes = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/comments/6")
      .send(updateCommentVotes)
      .expect(200)
      .then((rows) => {
        let finalRow = rows.body.comment;

        expect(finalRow).toMatchObject({
          comment_id: 6,
          body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
          review_id: 3,
          author: "philippaclaire9",
          votes: 9,
          created_at: "2021-03-27T19:49:48.110Z",
        });
      });
  });
  test("400 - invalid id", () => {
    const updateCommentVotes = {
      inc_votes: 12,
    };
    return request(app)
      .patch("/api/comments/nonsense")
      .send(updateCommentVotes)
      .expect(400)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);
        expect(parsedRes).toEqual({
          msg: `Bad request`,
        });
      });
  });
  test("400 - incorrect body passed", () => {
    const updateCommentVotes = {
      name: "bobby-lee",
    };
    return request(app)
      .patch("/api/comments/6")
      .send(updateCommentVotes)
      .expect(400)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);
        expect(parsedRes).toEqual({
          msg: `Bad request`,
        });
      });
  });
  test("404 - non-existing id", () => {
    const updateCommentVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/6000")
      .send(updateCommentVotes)
      .expect(404)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);

        expect(parsedRes).toEqual({
          msg: `Not found`,
        });
      });
  });
});

////////// POST new user //////////

describe("POST /api/users", () => {
  test("201 - POST user object creates new user", () => {
    const newUser = {
      username: "amaanZilla",
      name: "amaan mughal",
      avatar_url:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.majorgeeks.com%2Fnews%2Fstory%2Frandom_photo_going_to_work.html&psig=AOvVaw3MIUvhPqGYcbQ2kGCczOVe&ust=1697448004117000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqGAoTCKiKktzc94EDFQAAAAAdAAAAABDyAg",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then((rows) => {
        let obj = rows.body.user;
        expect(obj.username).toBe("amaanZilla");
        expect(obj.name).toBe("amaan mughal");
        expect(obj.avatar_url).toBe(
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.majorgeeks.com%2Fnews%2Fstory%2Frandom_photo_going_to_work.html&psig=AOvVaw3MIUvhPqGYcbQ2kGCczOVe&ust=1697448004117000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqGAoTCKiKktzc94EDFQAAAAAdAAAAABDyAg"
        );
      });
  });
  test("201 - POST user uses default avatar_url", () => {
    const newUser = {
      username: "amaanZilla",
      name: "amaan mughal",
      avatar_url: "",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then((rows) => {
        let obj = rows.body.user;
        expect(obj.username).toBe("amaanZilla");
        expect(obj.name).toBe("amaan mughal");
        expect(obj.avatar_url).toBe(
          "https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
        );
      });
  });
  test("404 - Post user does not have valid name", () => {
    const newUser = {
      username: "",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(404)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);

        expect(parsedRes).toEqual({
          msg: `Not found`,
        });
      });
  });
  test("404 - Post user does not have valid username", () => {
    const newUser = {
      name: "",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(404)
      .then((res) => {
        let parsedRes = JSON.parse(res.text);

        expect(parsedRes).toEqual({
          msg: `Not found`,
        });
      });
  });
});
