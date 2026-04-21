const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('optimize')
    .setDescription('⚡ Optimize code for performance, readability, and efficiency')
    .addStringOption(o => o.setName('code').setDescription('Paste code to optimize').setRequired(true).setMaxLength(2000))
    .addStringOption(o => o.setName('focus').setDescription('Optimization focus').setRequired(false)
      .addChoices(
        { name: '⚡ Performance / Speed', value: 'performance' },
        { name: '📖 Readability / Clean Code', value: 'readability' },
        { name: '💾 Memory Usage', value: 'memory' },
        { name: '🔄 All of the above', value: 'all' },
      )),

  async execute(interaction) {
    const code  = interaction.options.getString('code');
    const focus = interaction.options.getString('focus') || 'all';
    await runAICommand(interaction, {
      system: `You are HeroX Optimizer. Optimize code with focus on: ${focus}.
Format:
## 📊 Analysis
What's inefficient and why.
## ⚡ Optimized Code
The improved version in a code block.
## 📈 Improvements Made
Bullet list: what changed, the gain (e.g. O(n²) → O(n)).`,
      userMsg: `Optimize this code:\n\`\`\`\n${code}\n\`\`\``,
      title: '⚡ Optimized Code',
      color: COLORS.warning,
    });
  }
};
