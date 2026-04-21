const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stack')
    .setDescription('📦 Get a tech stack recommendation for your project')
    .addStringOption(o => o.setName('project').setDescription('Describe your project type and requirements').setRequired(true).setMaxLength(800)),

  async execute(interaction) {
    const project = interaction.options.getString('project');
    await runAICommand(interaction, {
      system: `You are HeroX Tech Advisor. Recommend the best tech stack for the given project.
Include: frontend, backend, database, caching, hosting, DevOps tools — with reasoning for each choice. Also list alternatives and trade-offs.`,
      userMsg: project,
      title: '📦 Stack Recommendation',
      color: COLORS.primary,
    });
  }
};
