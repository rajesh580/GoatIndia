const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userEmail: { type: DataTypes.STRING, allowNull: false },
  items: { type: DataTypes.TEXT, allowNull: false }, 
  shippingAddress: { type: DataTypes.TEXT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  
  isCancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
  cancelReason: { type: DataTypes.STRING, allowNull: true },

  // SHIPMENT STATUS
  // 0: PENDING, 1: PREPARING, 2: SHIPPED, 3: OUT FOR DELIVERY, 4: DELIVERED
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  deliveredAt: { type: DataTypes.DATE, allowNull: true },

  // NEW: PAYMENT STATUS
  isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
  paidAt: { type: DataTypes.DATE, allowNull: true }
});

module.exports = Order;