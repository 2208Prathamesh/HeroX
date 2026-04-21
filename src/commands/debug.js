const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('🐛 Analyze an error or stack trace and get a fix')
    .addStringOption(o => o.setName('error').setDescription('Paste your error message or stack trace').setRequired(true).setMaxLength(2000))
    .addStringOption(o => o.setName('code').setDescription('Optional: relevant code context').setRequired(false).setMaxLength(1000)),

  async execute(interaction) {
    const error = interaction.options.getString('error');
    const code  = interaction.options.getString('code') || '';
    await runAICommand(interaction, {
      system: `You are HeroX Debugger. Analyze errors and provide actionable fixes.
Format your response as:

## 🔍 Root Cause
Explain exactly why this error occurs.

## 🛠️ Fix
Provide the corrected code with explanation.

## 🧪 How to Verify
How to confirm the fix works.

## 🛡️ Prevention
How to avoid this class of bug in future.`,
      userMsg: `Error:\n\`\`\`\n${error}\n\`\`\`${code ? `\n\nCode context:\n\`\`\`\n${code}\n\`\`\`` : ''}`,
      title: '🐛 Debug Analysis',
      color: COLORS.error,
    });
  }
};
