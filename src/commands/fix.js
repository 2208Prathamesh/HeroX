const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fix')
    .setDescription('🔧 Fix a bug — describe the issue and paste your code')
    .addStringOption(o => o.setName('code').setDescription('Paste the buggy code').setRequired(true).setMaxLength(2000))
    .addStringOption(o => o.setName('issue').setDescription('Describe what is wrong').setRequired(true).setMaxLength(500)),

  async execute(interaction) {
    const code  = interaction.options.getString('code');
    const issue = interaction.options.getString('issue');
    await runAICommand(interaction, {
      system: `You are HeroX Bug Fixer. Fix code bugs precisely.
Respond with:
1. **What was wrong** — brief explanation
2. **Fixed code** — complete working version in a code block
3. **Changes made** — bullet list of what you changed and why`,
      userMsg: `Issue: ${issue}\n\nCode:\n\`\`\`\n${code}\n\`\`\``,
      title: '🔧 Bug Fixed',
      color: COLORS.success,
    });
  }
};
