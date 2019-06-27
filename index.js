const express = require("express");
const app = express();

app.use(express.json());

app.use("/api", require("./rotas"));

app.listen(process.env.PORT || 3001);
