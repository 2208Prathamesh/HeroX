const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snippet')
    .setDescription('⚡ Get a quick, focused code snippet for a specific task')
    .addStringOption(o => o.setName('task').setDescription('What do you need? (e.g. debounce function in JS)').setRequired(true).setMaxLength(500))
    .addStringOption(o => o.setName('language').setDescription('Language (default: JavaScript)').setRequired(false)),

  async execute(interaction) {
    const task = interaction.options.getString('task');
    const lang = interaction.options.getString('language') || 'JavaScript';
    await runAICommand(interaction, {
      system: `You are HeroX. Provide a clean, minimal ${lang} code snippet for the requested task. No fluff — just the snippet with a 2-3 line explanation. Use modern syntax.`,
      userMsg: task,
      title: `⚡ ${lang} Snippet`,
      color: COLORS.code,
    });
  }
};
