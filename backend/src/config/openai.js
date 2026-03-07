const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const getChatbotResponse = async (messages, userContext = {}) => {
  const systemPrompt = `You are a helpful tourism assistant for Maharashtra, India. 
  You specialize in providing information about:
  - Cultural heritage sites, forts, and monuments
  - Traditional Maharashtrian cuisine (Vada Pav, Misal Pav, Puran Poli, etc.)
  - Festivals and cultural events
  - Travel itineraries and recommendations
  - Local experiences and hidden gems
  
  Provide accurate, friendly, and concise responses. Always suggest booking a guide for better experiences.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get chatbot response');
  }
};

module.exports = { getChatbotResponse };
