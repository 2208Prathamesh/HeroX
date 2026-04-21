const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('docs')
    .setDescription('📄 Generate JSDoc/docstring documentation for your code')
    .addStringOption(o => o.setName('code').setDescription('Paste code to document').setRequired(true).setMaxLength(2000))
    .addStringOption(o => o.setName('style').setDescription('Doc style').setRequired(false)
      .addChoices(
        { name: 'JSDoc (JavaScript)', value: 'jsdoc' },
        { name: 'Python Docstrings', value: 'python' },
        { name: 'Javadoc', value: 'javadoc' },
        { name: 'TypeDoc', value: 'typedoc' },
      )),

  async execute(interaction) {
    const code  = interaction.options.getString('code');
    const style = interaction.options.getString('style') || 'jsdoc';
    await runAICommand(interaction, {
      system: `You are HeroX Documentation Generator. Add comprehensive ${style} documentation.
- Document every function, parameter, return type, and thrown errors
- Add usage examples where helpful
- Keep descriptions clear and concise
Return the fully documented code.`,
      userMsg: `Add ${style} docs to:\n\`\`\`\n${code}\n\`\`\``,
      title: '📄 Documented Code',
      color: COLORS.info,
    });
  }
};
