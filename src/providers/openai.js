const OpenAI = require('openai');

async function chat(apiKey, system, user, opts = {}) {
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model: opts.model || 'gpt-4o',
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    max_tokens: opts.maxTokens || 4096,
    temperature: opts.temperature ?? 0.7,
  });
  return res.choices[0].message.content;
}

async function generateImage(apiKey, prompt, opts = {}) {
  const client = new OpenAI({ apiKey });
  const res = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: opts.size || '1024x1024',
    quality: opts.quality || 'hd',
    style: opts.style || 'vivid',
  });
  return { url: res.data[0].url, revisedPrompt: res.data[0].revised_prompt };
}

module.exports = { chat, generateImage };
