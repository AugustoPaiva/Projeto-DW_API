const express = require("express");
var bodyParser = require("body-parser");
const controlador = require("./controlador");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.get("/infracoes", controlador.retornaPontos);

app.use("/api", require("./rotas"));

app.listen(process.env.PORT || 3001);
