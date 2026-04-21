const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('design')
    .setDescription('🏛️ Explain a design pattern with real code examples')
    .addStringOption(o => o.setName('pattern').setDescription('Pattern name (e.g. Singleton, Observer, Factory, CQRS)').setRequired(true).setMaxLength(200))
    .addStringOption(o => o.setName('language').setDescription('Language for code examples').setRequired(false)),

  async execute(interaction) {
    const pattern = interaction.options.getString('pattern');
    const lang    = interaction.options.getString('language') || 'JavaScript';
    await runAICommand(interaction, {
      system: `You are HeroX Design Patterns Expert. Explain design patterns with real-world ${lang} examples.
Include: intent, when to use it, when NOT to use it, UML-like structure (text), and a practical code example. Mention trade-offs.`,
      userMsg: pattern,
      title: `🏛️ ${pattern} Pattern`,
      color: COLORS.primary,
    });
  }
};
