const { SlashCommandBuilder } = require('discord.js');
const { removeKey } = require('../utils/keystore');
const { successEmbed, errorEmbed } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removekey')
    .setDescription('🗑️ Remove your stored API key from HeroX'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      removeKey(interaction.user.id);
      await interaction.editReply({
        embeds: [successEmbed('Key Removed', 'Your API key has been **permanently deleted** from HeroX.\n\nUse `/setkey` to add a new one anytime.')]
      });
    } catch (e) {
      await interaction.editReply({ embeds: [errorEmbed('Failed', e.message)] });
    }
  }
};
