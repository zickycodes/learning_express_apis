const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("learning_node_restAPIS", "root", "zicky", {
  dialect: "mysql",
  port: "3306",
  host: "127.0.0.1",
});

module.exports = sequelize;
