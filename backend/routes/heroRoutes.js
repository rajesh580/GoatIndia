const express = require('express');
const router = express.Router();
const { getHeroSlides, createHeroSlide } = require('../controllers/heroController');

router.get('/', getHeroSlides);
router.post('/', createHeroSlide);

module.exports = router;