const Sequelize = require("sequelize");

const db = new Sequelize("dw", "root", "infracoes", {
  host: "dw.ccfs4joc0ibo.sa-east-1.rds.amazonaws.com",
  dialect: "mysql"
});

const retorno = db
  .query(
    "select bairro.nome,hr.hora, count(hr.hora) from fatoinfracao as infra inner join dimhora as hr " +
      "on hr.key_hora = infra.key_hora inner join dimbairro as bairro on bairro.key_bairro = infra.key_bairro group by bairro.nome order by count(hr.hora) desc limit 5",
    {
      raw: true
    }
  )
  .then(retorno => {
    console.log(retorno);
  });
