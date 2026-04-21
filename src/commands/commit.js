const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commit')
    .setDescription('📝 Generate a conventional commit message from your changes')
    .addStringOption(o => o.setName('changes').setDescription('Describe what you changed (or paste a diff)').setRequired(true).setMaxLength(1500)),

  async execute(interaction) {
    const changes = interaction.options.getString('changes');
    await runAICommand(interaction, {
      system: `You are HeroX Commit Message Generator. Generate Conventional Commits format messages.
Output:
1. **Recommended commit** (primary suggestion)
2. **Alternatives** (2-3 options with different scopes/types)
3. **Full commit body** (optional extended description)
Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build`,
      userMsg: changes,
      title: '📝 Commit Messages',
      color: COLORS.code,
    });
  }
};
