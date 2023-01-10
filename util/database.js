const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  "freedb_learning_node_restAPIS",
  "freedb_Zicky",
  "Ks3ZVqQ@EYP&GgJ",
  {
    dialect: "mysql",
    port: "3306",
    host: "sql.freedb.tech",
  }
);

module.exports = sequelize;
