const { SlashCommandBuilder } = require('discord.js');
const { setKey } = require('../utils/keystore');
const { successEmbed, errorEmbed, base, COLORS } = require('../utils/embed');
const { PROVIDERS } = require('../providers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setkey')
    .setDescription('🔑 Connect your AI provider API key to HeroX')
    .addStringOption(o => o.setName('provider').setDescription('Choose your AI provider').setRequired(true)
      .addChoices(
        { name: '🆓 OpenRouter — FREE (Llama 3.1, Gemma, etc.)', value: 'openrouter' },
        { name: '🟢 OpenAI — GPT-4o + DALL-E 3 image gen',       value: 'openai'     },
        { name: '🟠 Anthropic — Claude 3.5 Sonnet',               value: 'anthropic'  },
        { name: '🔵 Google — Gemini 1.5 Pro',                     value: 'gemini'     },
      ))
    .addStringOption(o => o.setName('api_key').setDescription('Your API key (message is ephemeral/private)').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const provider = interaction.options.getString('provider');
    const apiKey   = interaction.options.getString('api_key');

    // Format validation
    const checks = {
      openai:     s => s.startsWith('sk-'),
      anthropic:  s => s.startsWith('sk-ant-'),
      gemini:     s => s.startsWith('AIza'),
      openrouter: s => s.startsWith('sk-or-'),
    };
    if (checks[provider] && !checks[provider](apiKey)) {
      const hints = {
        openai:    '`sk-...`',
        anthropic: '`sk-ant-...`',
        gemini:    '`AIza...`',
        openrouter:'`sk-or-...` (get free key at openrouter.ai)',
      };
      return interaction.editReply({
        embeds: [errorEmbed('Invalid Key Format',
          `**${PROVIDERS[provider].name}** keys look like ${hints[provider]}\n\nPlease double-check your key.`)]
      });
    }

    try {
      setKey(interaction.user.id, provider, apiKey);
      const p = PROVIDERS[provider];
      const isOpenRouter = provider === 'openrouter';
      await interaction.editReply({
        embeds: [
          base(COLORS.success)
            .setTitle('🔑 API Key Saved!')
            .setDescription([
              `**Provider:** ${p.emoji} ${p.name}`,
              `**Key:** \`${apiKey.slice(0, 10)}${'•'.repeat(10)}\``,
              '',
              isOpenRouter ? '> 🆓 **Free tier active** — using `meta-llama/llama-3.1-8b-instruct:free`' : '',
              '> 🔒 Your key is **encrypted** with AES-256-GCM — never shared.',
              '',
              `✨ All set! Try \`/ask\`, \`/codegen\`, or \`/help\``,
            ].filter(Boolean).join('\n'))
        ]
      });
    } catch (e) {
      await interaction.editReply({ embeds: [errorEmbed('Save Failed', `\`${e.message}\``)] });
    }
  }
};
