const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('🔍 Get a full code review with bugs, improvements, and best practices')
    .addStringOption(o => o.setName('code').setDescription('Paste your code here').setRequired(true).setMaxLength(2000)),

  async execute(interaction) {
    const code = interaction.options.getString('code');
    await runAICommand(interaction, {
      system: `You are HeroX Code Reviewer — a senior software engineer with 15+ years of experience.
Review code thoroughly and structure your response as:

## 🐛 Bugs & Issues
List any actual bugs or potential runtime errors.

## ⚡ Performance
Identify inefficiencies and how to fix them.

## 🏗️ Architecture & Best Practices
What design patterns, SOLID principles, or conventions are violated?

## 🔒 Security
Any security vulnerabilities (injection, exposure, etc.)

## ✅ What's Good
Acknowledge what the developer did well.

## 🚀 Improved Version
Provide an improved code snippet with fixes applied.`,
      userMsg: `Review this code:\n\`\`\`\n${code}\n\`\`\``,
      title: '🔍 Code Review',
      color: COLORS.warning,
    });
  }
};
