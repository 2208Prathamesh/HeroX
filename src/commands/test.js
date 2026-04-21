const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('🧪 Generate unit tests for your code')
    .addStringOption(o => o.setName('code').setDescription('Paste the function/class to test').setRequired(true).setMaxLength(2000))
    .addStringOption(o => o.setName('framework').setDescription('Testing framework').setRequired(false)
      .addChoices(
        { name: 'Jest (JS/TS)', value: 'jest' },
        { name: 'Mocha + Chai', value: 'mocha' },
        { name: 'PyTest (Python)', value: 'pytest' },
        { name: 'JUnit (Java)', value: 'junit' },
        { name: 'Go Test', value: 'gotest' },
      )),

  async execute(interaction) {
    const code      = interaction.options.getString('code');
    const framework = interaction.options.getString('framework') || 'jest';
    await runAICommand(interaction, {
      system: `You are HeroX Test Generator. Write comprehensive unit tests using ${framework}.
Include:
- Happy path tests
- Edge cases (null, empty, boundary values)
- Error/exception cases
- Mock external dependencies where needed
Use descriptive test names and follow AAA pattern (Arrange, Act, Assert).`,
      userMsg: `Generate ${framework} tests for:\n\`\`\`\n${code}\n\`\`\``,
      title: `🧪 Unit Tests (${framework})`,
      color: COLORS.success,
    });
  }
};
