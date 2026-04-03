const HeroSlide = require('../models/HeroSlide');

// @desc    Get all active slides for the home screen
// @route   GET /api/heroslides
exports.getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.findAll({ where: { isActive: true } });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slides', error: error.message });
  }
};

// @desc    Create a new slide (Used for adding cards)
// @route   POST /api/heroslides
exports.createHeroSlide = async (req, res) => {
  try {
    const { image, title, link } = req.body;
    const slide = await HeroSlide.create({ image, title, link });
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ message: 'Error creating slide', error: error.message });
  }
};