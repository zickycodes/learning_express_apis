const sequelize = require("../util/database");
const { Sequelize, DataTypes } = require("sequelize");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Post;
