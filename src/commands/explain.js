const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('explain')
    .setDescription('📖 Explain what a piece of code does, line by line')
    .addStringOption(o => o.setName('code').setDescription('Paste the code to explain').setRequired(true).setMaxLength(2000))
    .addStringOption(o => o.setName('level').setDescription('Explanation level').setRequired(false)
      .addChoices(
        { name: '🟢 Beginner', value: 'beginner' },
        { name: '🟡 Intermediate', value: 'intermediate' },
        { name: '🔴 Expert', value: 'expert' },
      )),

  async execute(interaction) {
    const code  = interaction.options.getString('code');
    const level = interaction.options.getString('level') || 'intermediate';
    await runAICommand(interaction, {
      system: `You are HeroX Code Explainer. Explain code clearly at a ${level} level.
Structure:
## 🎯 Overview
One-sentence summary of what this code does.
## 📝 Line-by-Line Breakdown
Explain each important part with inline comments style.
## 💡 Key Concepts
List the programming concepts used.
## 🔄 Flow Diagram (text)
A simple ASCII or text flow of how it executes.`,
      userMsg: `Explain this code:\n\`\`\`\n${code}\n\`\`\``,
      title: '📖 Code Explanation',
      color: COLORS.info,
    });
  }
};
