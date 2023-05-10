const express = require("express");
const { getCategories, getEndpoints } = require("./controllers/controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api", getEndpoints);

module.exports = app;
