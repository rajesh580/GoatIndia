const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  rating: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  comment: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  userName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  }
}, {
  // Option A: If you want to keep 'createdAt' but don't want 'updatedAt'
  timestamps: true,
  updatedAt: false, // This prevents the 'Unknown column updatedAt' error
  
  // Ensure the table name matches exactly what is in phpMyAdmin
  tableName: 'Reviews' 
});

module.exports = Review;