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
});
