const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('🧠 Ask HeroX any dev question — architecture, concepts, best practices')
    .addStringOption(o => o.setName('question').setDescription('Your development question').setRequired(true).setMaxLength(1000)),

  async execute(interaction) {
    const q = interaction.options.getString('question');
    await runAICommand(interaction, {
      system: `You are HeroX, a world-class AI assistant for software engineers and developers. 
You provide concise, accurate, and practical answers. 
Use markdown formatting with code blocks where appropriate. 
Be direct and helpful — no fluff. When answering, prefer real-world examples.`,
      userMsg: q,
      title: '🧠 HeroX Answer',
      color: COLORS.primary,
    });
  }
};
