const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('algorithm')
    .setDescription('🧮 Explain or implement an algorithm')
    .addStringOption(o => o.setName('name').setDescription('Algorithm name or description (e.g. binary search, Dijkstra)').setRequired(true).setMaxLength(300))
    .addStringOption(o => o.setName('language').setDescription('Implementation language (default: Python)').setRequired(false)),

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const lang = interaction.options.getString('language') || 'Python';
    await runAICommand(interaction, {
      system: `You are HeroX Algorithm Expert. Explain and implement algorithms clearly.
Provide: concept overview, step-by-step logic, ${lang} implementation, time/space complexity, and real-world use cases.`,
      userMsg: name,
      title: `🧮 Algorithm: ${name}`,
      color: COLORS.primary,
    });
  }
};
