const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('brainstorm')
    .setDescription('💡 Brainstorm ideas, feature lists, or project names')
    .addStringOption(o => o.setName('topic').setDescription('What do you want to brainstorm about?').setRequired(true).setMaxLength(500)),

  async execute(interaction) {
    const topic = interaction.options.getString('topic');
    await runAICommand(interaction, {
      system: `You are HeroX Creative AI. Generate creative, diverse, and practical ideas. Be specific and actionable. Format as a numbered list with brief explanations. Think outside the box.`,
      userMsg: `Brainstorm: ${topic}`,
      title: '💡 Brainstorm Ideas',
      color: COLORS.warning,
    });
  }
};
