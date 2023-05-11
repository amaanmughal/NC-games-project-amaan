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
