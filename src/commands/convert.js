const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('🔄 Convert code from one language to another')
    .addStringOption(o => o.setName('code').setDescription('Paste the code to convert').setRequired(true).setMaxLength(2000))
    .addStringOption(o => o.setName('from').setDescription('Source language').setRequired(true))
    .addStringOption(o => o.setName('to').setDescription('Target language').setRequired(true)),

  async execute(interaction) {
    const code = interaction.options.getString('code');
    const from = interaction.options.getString('from');
    const to   = interaction.options.getString('to');
    await runAICommand(interaction, {
      system: `You are HeroX Code Converter. Convert code between programming languages accurately.
Preserve logic exactly. Use idiomatic patterns of the target language. Note any limitations or behavioural differences.`,
      userMsg: `Convert from ${from} to ${to}:\n\`\`\`${from}\n${code}\n\`\`\``,
      title: `🔄 ${from} → ${to}`,
      color: COLORS.code,
    });
  }
};
