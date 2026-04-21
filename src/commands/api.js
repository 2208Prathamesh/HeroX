const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('api')
    .setDescription('📡 Design a REST API with endpoints, schemas, and best practices')
    .addStringOption(o => o.setName('description').setDescription('Describe your API (what it does, resources it manages)').setRequired(true).setMaxLength(800)),

  async execute(interaction) {
    const desc = interaction.options.getString('description');
    await runAICommand(interaction, {
      system: `You are HeroX API Designer. Design RESTful APIs following OpenAPI best practices.
Provide: endpoint list (method + path + description), request/response schemas, status codes, authentication strategy, and rate limiting recommendations. Use proper REST conventions.`,
      userMsg: desc,
      title: '📡 API Design',
      color: COLORS.primary,
    });
  }
};
