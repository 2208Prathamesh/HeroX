const OpenAI = require('openai');

async function chat(apiKey, system, user, opts = {}) {
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://herox-bot.dev',
      'X-Title': 'HeroX AI Discord Bot',
    },
  });
  
  // Use OpenRouter's new automatic free routing endpoint.
  // This prevents the "404 No endpoints found" error because it automatically 
  // falls back to whatever free models are currently online and available!
  const res = await client.chat.completions.create({
    model: opts.model || 'openrouter/free',
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    max_tokens: opts.maxTokens || 4096,
    temperature: opts.temperature ?? 0.7,
  });
  return res.choices[0].message.content;
}

module.exports = { chat };
