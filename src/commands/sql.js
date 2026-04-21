const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sql')
    .setDescription('🗄️ Generate SQL queries from plain English')
    .addStringOption(o => o.setName('request').setDescription('Describe the query you need').setRequired(true).setMaxLength(800))
    .addStringOption(o => o.setName('dialect').setDescription('SQL dialect').setRequired(false)
      .addChoices(
        { name: 'PostgreSQL', value: 'PostgreSQL' },
        { name: 'MySQL', value: 'MySQL' },
        { name: 'SQLite', value: 'SQLite' },
        { name: 'SQL Server', value: 'SQL Server' },
        { name: 'MongoDB (aggregation)', value: 'MongoDB' },
      )),

  async execute(interaction) {
    const request = interaction.options.getString('request');
    const dialect = interaction.options.getString('dialect') || 'PostgreSQL';
    await runAICommand(interaction, {
      system: `You are HeroX SQL Expert. Generate optimized ${dialect} queries.
Provide: the query in a code block, an explanation, and performance notes (indexes, N+1 issues, etc.).`,
      userMsg: request,
      title: `🗄️ ${dialect} Query`,
      color: COLORS.code,
    });
  }
};
