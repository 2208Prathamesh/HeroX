const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('codegen')
    .setDescription('💻 Generate production-ready code from a description')
    .addStringOption(o => o.setName('description').setDescription('What code do you want generated?').setRequired(true).setMaxLength(1000))
    .addStringOption(o => o.setName('language').setDescription('Programming language (default: auto-detect)').setRequired(false)),

  async execute(interaction) {
    const desc = interaction.options.getString('description');
    const lang = interaction.options.getString('language') || 'auto-detect best language';
    await runAICommand(interaction, {
      system: `You are HeroX Code Generator. Generate clean, production-ready, well-commented code.
Language preference: ${lang}.
Rules:
- Always use modern syntax and best practices
- Include error handling
- Add brief comments explaining key logic
- Wrap code in proper markdown code blocks with language tag
- After the code, add a short "How it works" section`,
      userMsg: desc,
      title: '💻 Generated Code',
      color: COLORS.code,
    });
  }
};
