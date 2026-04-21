const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summarize')
    .setDescription('📝 Summarize a long article, doc, or piece of text')
    .addStringOption(o => o.setName('text').setDescription('Paste the text to summarize').setRequired(true).setMaxLength(3000)),

  async execute(interaction) {
    const text = interaction.options.getString('text');
    await runAICommand(interaction, {
      system: `You are HeroX Summarizer. Produce a clear, structured summary.
Provide: TL;DR (1-2 sentences), key points (bullet list), and important takeaways.`,
      userMsg: text,
      title: '📝 Summary',
      color: COLORS.info,
    });
  }
};
