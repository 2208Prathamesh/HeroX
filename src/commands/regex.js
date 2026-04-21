const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regex')
    .setDescription('🔍 Generate and explain a regular expression')
    .addStringOption(o => o.setName('description').setDescription('Describe what the regex should match').setRequired(true).setMaxLength(500))
    .addStringOption(o => o.setName('language').setDescription('Language/flavor (default: JavaScript)').setRequired(false)),

  async execute(interaction) {
    const desc = interaction.options.getString('description');
    const lang = interaction.options.getString('language') || 'JavaScript';
    await runAICommand(interaction, {
      system: `You are HeroX Regex Expert. Generate precise regular expressions for ${lang}.
Provide: the regex pattern, a step-by-step explanation of each part, test cases (matching and non-matching), and a usage code example.`,
      userMsg: desc,
      title: '🔍 Regex Pattern',
      color: COLORS.code,
    });
  }
};
