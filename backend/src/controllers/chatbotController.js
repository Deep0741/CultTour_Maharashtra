const { getChatbotResponse } = require('../config/openai');
const Destination = require('../models/Destination');
const Cuisine = require('../models/Cuisine');

// @desc    Chat with AI assistant
// @route   POST /api/v1/chatbot
// @access  Public
exports.chat = async (req, res, next) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }

    // Get chatbot response
    const response = await getChatbotResponse(messages, context);

    res.status(200).json({
      success: true,
      data: {
        message: response
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get itinerary suggestions
// @route   POST /api/v1/chatbot/itinerary
// @access  Public
exports.getItinerary = async (req, res, next) => {
  try {
    const { days, interests, budget } = req.body;

    // Fetch relevant destinations based on interests
    const destinations = await Destination.find({
      category: { $in: interests },
      isActive: true
    })
      .limit(days * 2)
      .select('name description location category images');

    // Create context for AI
    const destinationsContext = destinations.map(d => 
      `${d.name} (${d.category}) - ${d.location.city}`
    ).join(', ');

    const prompt = `Create a ${days}-day itinerary for Maharashtra tourism with interests in ${interests.join(', ')}. 
    Budget: ${budget}. Available destinations: ${destinationsContext}. 
    Provide day-wise plan with destinations, activities, and food recommendations.`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await getChatbotResponse(messages);

    res.status(200).json({
      success: true,
      data: {
        itinerary: response,
        suggestedDestinations: destinations
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get food recommendations
// @route   POST /api/v1/chatbot/food-recommendations
// @access  Public
exports.getFoodRecommendations = async (req, res, next) => {
  try {
    const { location, preferences, dietType } = req.body;

    // Fetch cuisines based on preferences
    const cuisines = await Cuisine.find({
      region: new RegExp(location, 'i'),
      type: dietType || { $exists: true },
      isActive: true
    })
      .limit(10)
      .select('name description category type spiceLevel');

    const cuisinesContext = cuisines.map(c => 
      `${c.name} (${c.category}, ${c.type})`
    ).join(', ');

    const prompt = `Recommend Maharashtrian dishes for someone in ${location} with preferences: ${preferences}. 
    Diet type: ${dietType}. Available dishes: ${cuisinesContext}. 
    Provide recommendations with descriptions and where to find them.`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await getChatbotResponse(messages);

    res.status(200).json({
      success: true,
      data: {
        recommendations: response,
        suggestedCuisines: cuisines
      }
    });
  } catch (error) {
    next(error);
  }
};
