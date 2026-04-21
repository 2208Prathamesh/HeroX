const Anthropic = require('@anthropic-ai/sdk');

async function chat(apiKey, system, user, opts = {}) {
  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: opts.model || 'claude-3-5-sonnet-20241022',
    max_tokens: opts.maxTokens || 4096,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return res.content[0].text;
}

module.exports = { chat };
