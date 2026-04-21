const { getKey } = require('../utils/keystore');
const openai      = require('./openai');
const anthropic   = require('./anthropic');
const gemini      = require('./gemini');
const openrouter  = require('./openrouter');

const PROVIDERS = {
  openai:      { name: 'OpenAI GPT-4o',               emoji: '🟢', chat: openai.chat,     supportsImages: true  },
  anthropic:   { name: 'Anthropic Claude 3.5 Sonnet',  emoji: '🟠', chat: anthropic.chat,  supportsImages: false },
  gemini:      { name: 'Google Gemini 1.5 Pro',        emoji: '🔵', chat: gemini.chat,     supportsImages: false },
  openrouter:  { name: 'OpenRouter (Free Tier)',       emoji: '🆓', chat: openrouter.chat, supportsImages: false },
};

async function getProvider(userId) {
  const kd = getKey(userId);
  
  // 1. If user set their own key, use it
  if (kd && PROVIDERS[kd.provider]) {
    const p = PROVIDERS[kd.provider];
    return {
      name:           p.name,
      emoji:          p.emoji,
      providerKey:    kd.provider,
      supportsImages: p.supportsImages,
      isGlobalFree:   false,
      chat:           (sys, usr, opts) => p.chat(kd.apiKey, sys, usr, opts),
      generateImage:  kd.provider === 'openai' ? (prompt, opts) => openai.generateImage(kd.apiKey, prompt, opts) : null,
    };
  }

  // 2. Fallback to Global Free Key (if developer added it to .env)
  if (process.env.GLOBAL_FREE_API_KEY) {
    const p = PROVIDERS.openrouter;
    return {
      name:           'Global Free AI (Gemma 2)',
      emoji:          '🆓',
      providerKey:    'openrouter',
      supportsImages: false,
      isGlobalFree:   true,
      chat:           (sys, usr, opts) => p.chat(process.env.GLOBAL_FREE_API_KEY, sys, usr, opts),
      generateImage:  null,
    };
  }

  // 3. No key found at all
  return null;
}

module.exports = { getProvider, PROVIDERS };
