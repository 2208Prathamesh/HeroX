const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mock')
    .setDescription('🎭 Generate realistic mock/test data for an API or schema')
    .addStringOption(o => o.setName('schema').setDescription('Describe your data structure or paste a schema/interface').setRequired(true).setMaxLength(1000))
    .addStringOption(o => o.setName('count').setDescription('How many records (1-20, default: 5)').setRequired(false)),

  async execute(interaction) {
    const schema = interaction.options.getString('schema');
    const count  = Math.min(parseInt(interaction.options.getString('count') || '5'), 20);
    await runAICommand(interaction, {
      system: `You are HeroX Mock Data Generator. Generate ${count} realistic, diverse, and valid JSON mock records matching the given schema. Use real-looking names, emails, dates, etc. No Lorem Ipsum. Return valid JSON.`,
      userMsg: schema,
      title: `🎭 Mock Data (${count} records)`,
      color: COLORS.code,
    });
  }
};
