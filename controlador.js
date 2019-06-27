const db = require("./config/dataBase");

module.exports = {
  async retornaPontos(req, res) {
    //essa rota serve pra retonar os pontos pra fazer o mapa de calor, muda pra o select ser na coluna quantidade da tabela fato
    const a = await db.query(
      "SELECT COUNT(logra.key_logradouro) as ocorrencias, logra.latitude, logra.longitude FROM fatoinfracao as infra INNER JOIN  dimlogradouro as logra " +
        " on infra.key_logradouro = logra.key_logradouro GROUP BY logra.key_logradouro",
      {
        raw: true
      }
    );
    res.json(a[0]);
  },

  async valorArrecadado(req, res) {
    //tabela pra saber o valor arrecadado, ai tem que relevar em consideração que vai receber ano e bairro
    //info vem no req.body.---
    const anoInicial = `where ano_id >= ${req.body.anoInicial}`;
    const anoFinal = `and ano_id >= ${req.body.anoInicial}`;
    const anoInicial = req.body.anoInicial;
    const anoFinal = req.body.anoInicial;
    const bairros = req.body.bairros;
    let where = "";
    if (req.params.AnoInicial != "0") {
      where += `WHERE  ${req.params.AnoInicial}`;
    }
    const retorno = await db.query(
      "SELECT sum(valor_multa) as total from fatoinfracao",
      { raw: true }
    );
    res.json(retorno);
  },

  async infraRecorrente(req, res) {
    //select para saber qual a infra mais recorrente, tenta fazer algo pra receber ano e lugar
    const retorno = await db.query(
      "SELECT infra.descricao, count(*) as quantidade from diminfracao as infra  inner join " +
        "fatoinfracao as fato on infra.key_infracao = fato.key_infracao GROUP by infra.key_infracao order by quantidade DESC limit 5",
      { raw: true }
    );
    res.json(retorno[0]);
  },

  async pontosAplicados(req, res) {
    //FALTA TERMINAR
    //select pra saber quantospontos foram aplicados, de novo levar em consideração ano e bairro
    const retorno = await db.query(
      "SELECT infra.descricao, count(*) as quantidade from diminfracao as infra  inner join " +
        "fatoinfracao as fato on infra.key_infracao = fato.key_infracao GROUP by infra.key_infracao order by quantidade DESC limit 5",
      { raw: true }
    );
    res.json(retorno[0]);
  },

  async QuantidadeInfracoes(req, res) {
    //FALTA TERMINAR
    // select para saber a quantidade de infrações, mudar pra o filtro de ano e bairro
    const retorno = await db.query(
      "SELECT SUM(quantidade) as quantidade FROM fatoinfracao ",
      { raw: true }
    );
    res.json(retorno[0]);
  },

  async horaPico(req, res) {
    //FALTA TERMINAR
    //esse toni vai ajeitar, mas é pra saber a hora de pico, ai coloquei em consideração o bairro mas nao o ano, ta limit 5 pq quero os 5 bairros com mais infraçoes e saber o horario de pico dele
    const retorno = await db.query(
      "select hr.hora, count(hr.hora) from fatoinfra as infra inner join dimhora as hr " +
        "on hr.key_hora = infra.key_hora group by hr.hora order by hr.hora desc limit 1",
      { raw: true }
    );
    res.json(retorno[0]);
  }
};
