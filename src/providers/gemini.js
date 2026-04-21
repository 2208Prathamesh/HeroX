const { GoogleGenerativeAI } = require('@google/generative-ai');

async function chat(apiKey, system, user, opts = {}) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: opts.model || 'gemini-1.5-pro',
    systemInstruction: system,
  });
  const result = await model.generateContent(user);
  return result.response.text();
}

module.exports = { chat };
