const express = require("express");
const routes = express.Router();
const controlador = require("./controlador");

routes.get("/infracoes", controlador.retornaPontos);
routes.post("/infracoes", controlador.retornaPontosPost);
routes.post("/valorMulta", controlador.valorArrecadado);
routes.post("/topInfracao", controlador.infraRecorrente);
routes.post("/quantidadeInfracoes", controlador.QuantidadeInfracoes);
routes.post("/horaPico", controlador.horaPico);
routes.post("/pontosAplicados", controlador.pontosAplicados);
routes.post('/infraSemestre', controlador.infraSemestre)

module.exports = routes;
