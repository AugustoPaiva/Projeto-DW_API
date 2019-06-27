const Sequelize = require("sequelize");

const db = new Sequelize("dw", "root", "infracoes", {
  host: "dw.ccfs4joc0ibo.sa-east-1.rds.amazonaws.com",
  dialect: "mysql"
});

module.exports = db;
