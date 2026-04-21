const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cicd')
    .setDescription('🚀 Generate a CI/CD pipeline for your project')
    .addStringOption(o => o.setName('stack').setDescription('Project stack and deployment target').setRequired(true).setMaxLength(500))
    .addStringOption(o => o.setName('platform').setDescription('CI/CD platform').setRequired(false)
      .addChoices(
        { name: 'GitHub Actions', value: 'github-actions' },
        { name: 'GitLab CI', value: 'gitlab-ci' },
        { name: 'CircleCI', value: 'circleci' },
        { name: 'Jenkins', value: 'jenkins' },
      )),

  async execute(interaction) {
    const stack    = interaction.options.getString('stack');
    const platform = interaction.options.getString('platform') || 'github-actions';
    await runAICommand(interaction, {
      system: `You are HeroX DevOps Expert. Generate a complete ${platform} CI/CD pipeline.
Include: lint, test, build, security scan, and deploy stages. Add branch protection rules and environment secrets guidance.`,
      userMsg: `Stack: ${stack}`,
      title: `🚀 ${platform} Pipeline`,
      color: COLORS.code,
    });
  }
};
