const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schema')
    .setDescription('🗂️ Generate a database schema from a description')
    .addStringOption(o => o.setName('description').setDescription('Describe your application data model').setRequired(true).setMaxLength(800))
    .addStringOption(o => o.setName('type').setDescription('Database type').setRequired(false)
      .addChoices(
        { name: 'SQL (PostgreSQL)', value: 'sql' },
        { name: 'MongoDB Schema', value: 'mongodb' },
        { name: 'Prisma Schema', value: 'prisma' },
        { name: 'TypeORM Entities', value: 'typeorm' },
        { name: 'Mongoose Models', value: 'mongoose' },
      )),

  async execute(interaction) {
    const desc = interaction.options.getString('description');
    const type = interaction.options.getString('type') || 'prisma';
    await runAICommand(interaction, {
      system: `You are HeroX Database Designer. Generate ${type} schemas with proper relationships, indexes, and constraints. Include field types, validations, and foreign keys where applicable.`,
      userMsg: desc,
      title: `🗂️ ${type} Schema`,
      color: COLORS.code,
    });
  }
};
