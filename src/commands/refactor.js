const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('refactor')
    .setDescription('♻️ Refactor code to follow SOLID, DRY, and clean code principles')
    .addStringOption(o => o.setName('code').setDescription('Paste code to refactor').setRequired(true).setMaxLength(2000)),

  async execute(interaction) {
    const code = interaction.options.getString('code');
    await runAICommand(interaction, {
      system: `You are HeroX Refactoring Expert. Apply clean code principles (SOLID, DRY, KISS, YAGNI).
Format:
## 🔍 Issues Found
What principles are violated and how.
## ♻️ Refactored Code
Clean version in a code block.
## 📋 Changes Summary
Bullet list of every refactoring applied.`,
      userMsg: `Refactor:\n\`\`\`\n${code}\n\`\`\``,
      title: '♻️ Refactored Code',
      color: COLORS.code,
    });
  }
};
