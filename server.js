const express = require("express");
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});

app.use("/api", require("./src/rotas"));

app.listen(process.env.PORT || 3001);
