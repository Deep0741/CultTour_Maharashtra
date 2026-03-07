const express = require('express');
const router = express.Router();
const {
  chat,
  getItinerary,
  getFoodRecommendations
} = require('../controllers/chatbotController');

router.post('/', chat);
router.post('/itinerary', getItinerary);
router.post('/food-recommendations', getFoodRecommendations);

module.exports = router;
