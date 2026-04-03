// backend/models/index.js
const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define Relationships
// A User can have many Orders
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// An Order contains many OrderItems
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// An OrderItem belongs to a specific Product
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Sync function to create/update tables
const syncDatabase = async () => {
  try {
    // alter: true checks current state of tables in DB and performs necessary changes to match the models
    await sequelize.sync({ alter: true }); 
    console.log('Database synchronized and relationships established.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

module.exports = { User, Product, Order, OrderItem, syncDatabase };