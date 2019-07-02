const db = require("./config/dataBase");

module.exports = {
  async retornaPontos(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); // If needed
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,contenttype"
    ); // If needed
    res.setHeader("Access-Control-Allow-Credentials", true); // If needed

    //essa rota serve pra retonar os pontos pra fazer o mapa de calor, muda pra o select ser na coluna quantidade da tabela fato
    const a = await db.query(
      "SELECT sum(quantidade) as ocorrencias, logra.latitude, logra.longitude FROM fatoinfracao as infra INNER JOIN  dimlogradouro as logra " +
        " on infra.key_logradouro = logra.key_logradouro GROUP BY logra.key_logradouro",
      {
        raw: true
      }
    );
    res.json(a[0]);
  },
  async retornaPontosPost(req, res) {
    let where = "";
    let bairros = "";
    const ano = req.body.ano;
    if (
      req.body.bairro != "" &&
      req.body.bairro != null &&
      req.body.bairro != undefined
    ) {
      //formatando texto
      bairros = "(";
      req.body.bairro.forEach(element => {
        bairros += `'${element}',`;
      });
      bairros = bairros.substring(0, bairros.length - 1) + ")";
    }

    //criando where
    where += ano != "" ? ` and dimdata.ano_id = ${ano} ` : "";
    where += bairros != "" ? ` and UPPER(bairro.nome) in ${bairros} ` : "";

    //essa rota serve pra retonar os pontos pra fazer o mapa de calor, muda pra o select ser na coluna quantidade da tabela fato
    const a = await db.query(
      `SELECT SUM(quantidade) AS ocorrencias, logra.latitude, logra.longitude
        FROM fatoinfracao AS infra
            JOIN dimlogradouro AS logra ON infra.key_logradouro = logra.key_logradouro
            JOIN dimbairro AS bairro ON infra.key_bairro = bairro.key_bairro
            JOIN dimdata ON infra.key_data = dimdata.key_data where 1=1 
        ${where} GROUP BY logra.key_logradouro`,
      {
        raw: true
      }
    );
    res.json(a[0]);
  },

  async valorArrecadado(req, res) {
    let where = "";
    let bairros = "";
    const ano = req.body.ano;
    if (
      req.body.bairro != "" &&
      req.body.bairro != null &&
      req.body.bairro != undefined
    ) {
      //formatando texto
      bairros = "(";
      req.body.bairro.forEach(element => {
        bairros += `'${element}',`;
      });
      bairros = bairros.substring(0, bairros.length - 1) + ")";
    }

    //criando where
    where += ano != "" ? ` and dimdata.ano_id = ${ano} ` : "";
    where += bairros != "" ? ` and UPPER(bairro.nome) in ${bairros} ` : "";

    const retorno = await db.query(
      `SELECT SUM(valor_multa) AS total, bairro.nome FROM fatoinfracao AS infra
      JOIN dimlogradouro AS logra ON infra.key_logradouro = logra.key_logradouro
      JOIN dimbairro AS bairro ON infra.key_bairro = bairro.key_bairro
      JOIN dimdata ON infra.key_data = dimdata.key_data 
      WHERE 1=1 
      AND bairro.nome IS NOT NULL
      ${where}
      GROUP BY bairro.key_bairro
      ORDER BY total DESC 
      LIMIT 5`,
      { raw: true }
    );

    res.json(retorno);
  },

  //FEITO
  async infraRecorrente(req, res) {
    let where = "";
    let bairros = "";
    const ano = req.body.ano;
    if (
      req.body.bairro != "" &&
      req.body.bairro != null &&
      req.body.bairro != undefined
    ) {
      //formatando texto
      bairros = "(";
      req.body.bairro.forEach(element => {
        bairros += `'${element}',`;
      });
      bairros = bairros.substring(0, bairros.length - 1) + ")";
    }

    //criando where
    where += ano != "" ? ` and dimdata.ano_id = ${ano} ` : "";
    where += bairros != "" ? ` and UPPER(bairro.nome) in ${bairros} ` : "";

    //select para saber qual a infra mais recorrente, tenta fazer algo pra receber ano e lugar
    const retorno = await db.query(
      `SELECT infracao.infracao_id, infracao.descricao, SUM(infra.quantidade) AS quantidade 
      FROM fatoinfracao AS infra  
      JOIN diminfracao AS infracao ON infra.key_infracao = infracao.key_infracao
      JOIN dimlogradouro AS logra ON infra.key_logradouro = logra.key_logradouro
      JOIN dimbairro AS bairro ON infra.key_bairro = bairro.key_bairro
      JOIN dimdata ON infra.key_data = dimdata.key_data 
      WHERE 1=1
      ${where}
      GROUP BY infra.key_infracao 
      ORDER BY quantidade DESC 
      LIMIT 5`,
      { raw: true }
    );
    res.json(retorno[0]);
  },

  //FEITO
  async pontosAplicados(req, res) {
    let where = "";
    let bairros = "";
    const ano = req.body.ano;
    if (
      req.body.bairro != "" &&
      req.body.bairro != null &&
      req.body.bairro != undefined
    ) {
      //formatando texto
      bairros = "(";
      req.body.bairro.forEach(element => {
        bairros += `'${element}',`;
      });
      bairros = bairros.substring(0, bairros.length - 1) + ")";
    }

    //criando where
    where += ano != "" ? ` and dimdata.ano_id = ${ano} ` : "";
    where += bairros != "" ? ` and UPPER(bairro.nome) in ${bairros} ` : "";

    const retorno = await db.query(
      `SELECT bairro.nome, SUM(infra.valor_ponto)/SUM(infra.quantidade) AS media, SUM(infra.quantidade)
      FROM fatoinfracao AS infra
      JOIN diminfracao AS infracao ON infra.key_infracao = infracao.key_infracao
      JOIN dimlogradouro AS logra ON infra.key_logradouro = logra.key_logradouro
      JOIN dimbairro AS bairro ON infra.key_bairro = bairro.key_bairro
      JOIN dimdata ON infra.key_data = dimdata.key_data where 1=1
      ${where}
      GROUP BY bairro.key_bairro
      ORDER BY media DESC 
      LIMIT 5`,
      { raw: true }
    );
    res.json(retorno[0]);
  },

  async QuantidadeInfracoes(req, res) {
    let where = "";
    let bairros = "";
    const ano = req.body.ano;
    if (
      req.body.bairro != "" &&
      req.body.bairro != null &&
      req.body.bairro != undefined
    ) {
      //formatando texto
      bairros = "(";
      req.body.bairro.forEach(element => {
        bairros += `'${element}',`;
      });
      bairros = bairros.substring(0, bairros.length - 1) + ")";
    }

    //criando where
    where += ano != "" ? ` and dimdata.ano_id = ${ano} ` : "";
    where += bairros != "" ? ` and UPPER(bairro.nome) in ${bairros} ` : "";

    const retorno = await db.query(
      `SELECT bairro.nome, COUNT(infra.quantidade) AS quantidade 
      FROM fatoinfracao AS infra  
      JOIN diminfracao AS infracao ON infra.key_infracao = infracao.key_infracao
      JOIN dimlogradouro AS logra ON infra.key_logradouro = logra.key_logradouro
      JOIN dimbairro AS bairro ON infra.key_bairro = bairro.key_bairro
      JOIN dimdata ON infra.key_data = dimdata.key_data 
      WHERE 1=1
      ${where}
      GROUP BY infra.key_bairro
      ORDER BY quantidade DESC 
      LIMIT 5`,
      { raw: true }
    );
    res.json(retorno[0]);
  },

  //FEITO
  async horaPico(req, res) {
    let where = "";
    let bairros = "";
    const ano = req.body.ano;
    if (
      req.body.bairro != "" &&
      req.body.bairro != null &&
      req.body.bairro != undefined
    ) {
      //formatando texto
      bairros = "(";
      req.body.bairro.forEach(element => {
        bairros += `'${element}',`;
      });
      bairros = bairros.substring(0, bairros.length - 1) + ")";
    }

    //criando where
    where += ano != "" ? ` and dimdata.ano_id = ${ano} ` : "";
    where;
    //FALTA TERMINAR
    //esse toni vai ajeitar, mas é pra saber a hora de pico, ai coloquei em consideração o bairro mas nao o ano, ta limit 5 pq quero os 5 bairros com mais infraçoes e saber o horario de pico dele
    const retorno = await db.query(
      `SELECT hora.hora, SUM(infra.quantidade) AS quantidade
      FROM fatoinfracao AS infra
      JOIN diminfracao AS infracao ON infra.key_infracao = infracao.key_infracao
      JOIN dimlogradouro AS logra ON infra.key_logradouro = logra.key_logradouro
      JOIN dimbairro AS bairro ON infra.key_bairro = bairro.key_bairro
      JOIN dimdata ON infra.key_data = dimdata.key_data 
      JOIN dimhora AS hora ON infra.key_hora = hora.key_hora
      WHERE 1=1
      ${where}
      GROUP BY hora.key_hora
      ORDER BY quantidade DESC 
      LIMIT 5`,
      { raw: true }
    );
    res.json(retorno[0]);
  },
  async infraSemestre(req, res) {
    let where = "";
    let bairros = "";
    const ano = req.body.ano;
    if (
      req.body.bairro != "" &&
      req.body.bairro != null &&
      req.body.bairro != undefined
    ) {
      //formatando texto
      bairros = "(";
      req.body.bairro.forEach(element => {
        bairros += `'${element}',`;
      });
      bairros = bairros.substring(0, bairros.length - 1) + ")";
    }

    //criando where
    where += ano != "" ? ` and dimdata.ano_id = ${ano} ` : "";
    where;
    //FALTA TERMINAR
    //esse toni vai ajeitar, mas é pra saber a hora de pico, ai coloquei em consideração o bairro mas nao o ano, ta limit 5 pq quero os 5 bairros com mais infraçoes e saber o horario de pico dele
    const retorno = await db.query(
      `SELECT dimdata.semestre_texto, dimdata.ano_texto, SUM(infra.quantidade) AS quantidade 
      FROM fatoinfracao AS infra  
      JOIN diminfracao AS infracao ON infra.key_infracao = infracao.key_infracao
      JOIN dimlogradouro AS logra ON infra.key_logradouro = logra.key_logradouro
      JOIN dimbairro AS bairro ON infra.key_bairro = bairro.key_bairro
      JOIN dimdata ON infra.key_data = dimdata.key_data 
      WHERE 1=1
      ${where}
      GROUP BY dimdata.semestre_id
      ORDER BY dimdata.ano_id, dimdata.semestre_id `,
      { raw: true }
    );
    res.json(retorno[0]);
  }
};
