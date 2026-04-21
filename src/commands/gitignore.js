const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gitignore')
    .setDescription('📁 Generate a .gitignore file for your tech stack')
    .addStringOption(o => o.setName('stack').setDescription('Your tech stack (e.g. Node.js, Python, React, Docker)').setRequired(true).setMaxLength(300)),

  async execute(interaction) {
    const stack = interaction.options.getString('stack');
    await runAICommand(interaction, {
      system: `You are HeroX. Generate a comprehensive .gitignore file for the given stack. Include all common exclusions: build artifacts, dependencies, env files, IDE files, OS files, logs, and cache. Add section comments.`,
      userMsg: `Generate .gitignore for: ${stack}`,
      title: '📁 .gitignore File',
      color: COLORS.code,
    });
  }
};
