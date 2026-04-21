const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('readme')
    .setDescription('📋 Generate a professional README.md for your project')
    .addStringOption(o => o.setName('project').setDescription('Describe your project (name, purpose, tech stack)').setRequired(true).setMaxLength(1000)),

  async execute(interaction) {
    const project = interaction.options.getString('project');
    await runAICommand(interaction, {
      system: `You are HeroX README Generator. Create a professional, beautiful README.md.
Include: badges, project description, features list, installation, usage with code examples, API docs (if applicable), contributing guide, and license section.
Make it look great on GitHub with proper markdown.`,
      userMsg: project,
      title: '📋 Generated README.md',
      color: COLORS.primary,
    });
  }
};
