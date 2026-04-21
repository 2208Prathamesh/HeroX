const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('complexity')
    .setDescription('📊 Analyze the time and space complexity of your code')
    .addStringOption(o => o.setName('code').setDescription('Paste code to analyze').setRequired(true).setMaxLength(2000)),

  async execute(interaction) {
    const code = interaction.options.getString('code');
    await runAICommand(interaction, {
      system: `You are HeroX Complexity Analyzer. Analyze Big-O complexity accurately.
Format:
## ⏱️ Time Complexity: O(?)
Explain why with step-by-step reasoning.
## 💾 Space Complexity: O(?)  
Explain memory usage.
## 🔄 Best / Average / Worst Case
All three scenarios.
## 🚀 How to Improve
Suggest a more optimal approach if possible.`,
      userMsg: `Analyze complexity:\n\`\`\`\n${code}\n\`\`\``,
      title: '📊 Complexity Analysis',
      color: COLORS.warning,
    });
  }
};
