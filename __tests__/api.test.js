const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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
        expect(JSON.parse(res.body.data)).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/categories": {
            description: "serves an array of all categories",
            exampleResponse: {
              categories: [
                {
                  description:
                    "Players attempt to uncover each other's hidden role",
                  slug: "Social deduction",
                },
              ],
            },
            queries: [],
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews",
            exampleResponse: {
              reviews: [
                {
                  category: "hidden-roles",
                  comment_count: 6,
                  created_at: "2018-05-30T15:59:13.341Z",
                  designer: "Akihisa Okui",
                  owner: "happyamy2016",
                  review_img_url:
                    "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  title: "One Night Ultimate Werewolf",
                  votes: 0,
                },
              ],
            },
            queries: ["category", "sort_by", "order"],
          },
        });
      });
  });
});
