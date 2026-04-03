const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HeroSlide = sequelize.define('HeroSlide', {
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false, // This is where you put '/tshirts', '/hoodies', etc.
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = HeroSlide;