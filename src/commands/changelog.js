const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('📜 Generate a CHANGELOG.md from your version changes')
    .addStringOption(o => o.setName('changes').setDescription('List your changes (features, fixes, breaking changes)').setRequired(true).setMaxLength(1500))
    .addStringOption(o => o.setName('version').setDescription('Version number (e.g. 2.1.0)').setRequired(false)),

  async execute(interaction) {
    const changes = interaction.options.getString('changes');
    const version = interaction.options.getString('version') || 'x.x.x';
    await runAICommand(interaction, {
      system: `You are HeroX. Generate a professional CHANGELOG.md entry in "Keep a Changelog" format for version ${version}. Group into Added, Changed, Deprecated, Removed, Fixed, Security.`,
      userMsg: changes,
      title: `📜 CHANGELOG v${version}`,
      color: COLORS.code,
    });
  }
};
