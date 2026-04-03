const Product = require('../models/Product');
const Review = require('../models/Review');
const { Op } = require('sequelize');

// 1. Get all products (with optional category filter)
const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const keyword = req.query.keyword;

    let condition = {};
    if (category) condition.category = category;
    if (keyword) {
      condition.name = {
        [Op.like]: `%${keyword}%`
      };
    }

    const page = Number(req.query.page) || 1;
    // Default to a high limit unless requested so we don't break unpaginated features
    const limit = Number(req.query.limit) || 100; 
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({ 
      where: condition,
      limit,
      offset,
      include: [{
        model: Review,
        as: 'reviews'
      }]
    });
    
    res.json({ products: rows, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// 2. Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews' }]
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. Create a product
const createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, image, countInStock } = req.body;
    const product = await Product.create({
      name,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      description: description || "Premium Collection",
      category: category || "Apparel",
      image: image || "/images/placeholder.jpg",
      countInStock: countInStock || 10
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error: error.message });
  }
};

// 4. Get recommended products
const getRecommendedProducts = async (req, res) => {
  try {
    // Fetch all products to bypass SQL boolean parsing errors
    const products = await Product.findAll({
      include: [{ model: Review, as: 'reviews' }]
    });
    
    // Filter securely in JavaScript memory
    let recommended = products.filter(p => p.isRecommended === true || p.isRecommended === 1);
    
    // FALLBACK: If no products are explicitly marked as recommended in the DB,
    // default to showing the first 4 products so the section doesn't disappear.
    if (recommended.length === 0 && products.length > 0) {
      recommended = products.slice(0, 4);
    }

    res.json(recommended.slice(0, 4));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
};

// 5. Create new review
const createProductReview = async (req, res) => {
  const { rating, comment, userName, userId } = req.body;
  const productId = req.params.id;

  try {
    const review = await Review.create({
      rating: Number(rating),
      comment,
      userName,
      userId,
      productId
    });
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 6. Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ where: { productId: req.params.id } });
    res.json(reviews);
  } catch (error) {
    res.status(404).json({ message: 'Reviews not found' });
  }
};

// CRITICAL: All functions must be defined as const/function above before this block
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getRecommendedProducts,
  createProductReview,
  getProductReviews
};