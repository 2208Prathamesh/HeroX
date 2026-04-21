const { SlashCommandBuilder } = require('discord.js');
const { setImageKey } = require('../utils/keystore');
const { successEmbed, errorEmbed } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setimagekey')
    .setDescription('🎨 Set a dedicated image/video generation API key')
    .addStringOption(o => o.setName('provider').setDescription('Image provider').setRequired(true)
      .addChoices(
        { name: '🎨 Stability AI (SDXL)', value: 'stability' },
        { name: '🎬 Runway ML (Video Gen)', value: 'runway' },
      ))
    .addStringOption(o => o.setName('api_key').setDescription('Your API key').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const provider = interaction.options.getString('provider');
    const apiKey   = interaction.options.getString('api_key');
    try {
      setImageKey(interaction.user.id, provider, apiKey);
      await interaction.editReply({
        embeds: [successEmbed('Image/Video Key Saved!',
          `**Provider:** ${provider === 'stability' ? '🎨 Stability AI' : '🎬 Runway ML'}\n**Key:** \`${apiKey.slice(0,8)}••••••••\`\n\n> 🔒 Encrypted and stored locally.\n\nNow use \`/imagine\` or \`/videogen\`!`)]
      });
    } catch (e) {
      await interaction.editReply({ embeds: [errorEmbed('Save Failed', e.message)] });
    }
  }
};
