const sequelize = require("../util/database");
const { Sequelize, DataTypes } = require("sequelize");

const Author = sequelize.define("Author", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    default: "I am new!",
  },
});

module.exports = Author;
