const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  image: { 
    type: DataTypes.TEXT('long'), 
    allowNull: false 
  },
  images: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('images');
      if (!rawValue) return [];
      try {
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      } catch (error) {
        return rawValue; // Return the raw text if JSON fails so the frontend can extract the links!
      }
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value || []));
    }
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  category: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  // Selling Price (The price the user pays)
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
    defaultValue: 0.0
  },
  // ADDED: Original Price / MRP
  originalPrice: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: true,
    defaultValue: 0.0
  },
  countInStock: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 0
  },
  isRecommended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Product;