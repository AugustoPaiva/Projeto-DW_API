const express = require("express");
const app = express();
var cors = require("cors");

const routes = express.Router();

const controlador = require("./controlador");

routes.get("/infracoes", controlador.retornaPontos);
routes.get("/valorMulta/:anoInicial/:anoFinal", controlador.valorArrecadado);
routes.get("/topInfracao", controlador.infraRecorrente);
routes.get("/quantidadeInfracoes", controlador.QuantidadeInfracoes);
routes.get("/horaPico", controlador.horaPico);
module.exports = routes;
