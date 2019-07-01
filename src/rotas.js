const express = require("express");
const routes = express.Router();
const controlador = require("./controlador");

routes.get("/infracoes", controlador.retornaPontos);
routes.post("/infracoes", controlador.retornaPontosPost);
routes.get("/valorMulta/:anoInicial/:anoFinal", controlador.valorArrecadado);
routes.get("/topInfracao", controlador.infraRecorrente);
routes.get("/quantidadeInfracoes", controlador.QuantidadeInfracoes);
routes.get("/horaPico", controlador.horaPico);
routes.get("/infracoes", controlador.retornaPontos);

module.exports = routes;
