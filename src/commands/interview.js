const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('interview')
    .setDescription('🎤 Get interview questions and expert answers for a topic')
    .addStringOption(o => o.setName('topic').setDescription('Topic (e.g. React, System Design, SQL, JavaScript)').setRequired(true).setMaxLength(200))
    .addStringOption(o => o.setName('level').setDescription('Difficulty level').setRequired(false)
      .addChoices(
        { name: '🟢 Junior', value: 'junior' },
        { name: '🟡 Mid-level', value: 'mid' },
        { name: '🔴 Senior', value: 'senior' },
        { name: '🟣 Staff/Principal', value: 'staff' },
      )),

  async execute(interaction) {
    const topic = interaction.options.getString('topic');
    const level = interaction.options.getString('level') || 'mid';
    await runAICommand(interaction, {
      system: `You are HeroX Interview Coach. Generate 5-7 real interview questions for ${topic} at ${level} level with detailed model answers. Include follow-up questions and what interviewers look for.`,
      userMsg: `${level} ${topic} interview questions`,
      title: `🎤 ${topic} Interview Q&A`,
      color: COLORS.primary,
    });
  }
};
