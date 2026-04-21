const { SlashCommandBuilder } = require('discord.js');
const { getProvider } = require('../providers');
const { getKey, getImageKey } = require('../utils/keystore');
const { base, noKeyEmbed, COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mymodel')
    .setDescription('👤 Show your current AI model and key info'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const provider = await getProvider(interaction.user.id);
    const kd  = getKey(interaction.user.id);
    const ikd = getImageKey(interaction.user.id);

    if (!provider) return interaction.editReply({ embeds: [noKeyEmbed()] });

    const keyPreview = provider.isGlobalFree 
      ? 'Global Default Key (No setup needed)'
      : `\`${kd.apiKey.slice(0,8)}••••••••\``;

    const embed = base(COLORS.primary)
      .setTitle('👤 Your HeroX Profile')
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '🤖 AI Provider',   value: `${provider.emoji} **${provider.name}**`, inline: true  },
        { name: '🔑 Key Preview',   value: keyPreview, inline: true  },
        { name: '🖼️ Images',        value: provider.supportsImages ? '✅ DALL-E 3 (via your key)' : ikd ? `✅ ${ikd.provider}` : '❌ Not set — use `/setimagekey`', inline: false },
        { name: '🎬 Video Gen',     value: ikd?.provider === 'runway' ? '✅ Runway ML' : '❌ Not set — use `/setimagekey`', inline: false },
      )
      .setFooter({ text: '🔒 Keys are AES-256 encrypted | HeroX AI' });

    await interaction.editReply({ embeds: [embed] });
  }
};
