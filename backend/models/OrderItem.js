const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  size: { 
    type: DataTypes.STRING, 
    allowNull: false // Essential for hoodies (S, M, L, XL)
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  }
});

module.exports = OrderItem;