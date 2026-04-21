const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { splitCode } = require('./codeblock');

const COLORS = {
  primary: 0x5865F2,  // HeroX Blurple
  success: 0x57F287,
  error:   0xED4245,
  warning: 0xFEE75C,
  info:    0x5865F2,
  image:   0xFF6B9D,
  video:   0xFF9500,
  code:    0x00B4D8,
};

function base(color = COLORS.primary) {
  return new EmbedBuilder()
    .setColor(color)
    .setFooter({ text: '🤖 HeroX AI — Your Developer Agent' })
    .setTimestamp();
}

function noKeyEmbed() {
  return base(COLORS.warning)
    .setTitle('🔑 No API Key Found')
    .setDescription([
      '**Set up your AI provider first:**',
      '```',
      '/setkey provider:openai    api_key:sk-...',
      '/setkey provider:anthropic api_key:sk-ant-...',
      '/setkey provider:gemini    api_key:AIza...',
      '```',
      '> 🔒 Keys are encrypted and stored locally — never shared!'
    ].join('\n'));
}

function errorEmbed(title, desc) {
  return base(COLORS.error).setTitle(`❌ ${title}`).setDescription(desc);
}

function successEmbed(title, desc) {
  return base(COLORS.success).setTitle(`✅ ${title}`).setDescription(desc);
}

async function sendAIResponse(interaction, content, title, color = COLORS.primary, extraFields = []) {
  const chunks = splitCode(content, 3800);

  if (chunks.length === 1) {
    const embed = base(color).setTitle(title).setDescription(chunks[0]);
    if (extraFields.length) embed.addFields(extraFields);
    await interaction.editReply({ embeds: [embed], files: [] });
  } else {
    // Too long — send as file
    const file = new AttachmentBuilder(Buffer.from(content, 'utf8'), { name: 'herox-response.md' });
    const embed = base(color)
      .setTitle(title)
      .setDescription('📄 Response was too large for Discord — see attached file!')
      .addFields(
        { name: '📊 Size', value: `${content.length.toLocaleString()} chars`, inline: true },
        { name: '📝 Lines', value: `${content.split('\n').length.toLocaleString()}`, inline: true }
      );
    await interaction.editReply({ embeds: [embed], files: [file] });
  }
}

module.exports = { base, noKeyEmbed, errorEmbed, successEmbed, sendAIResponse, COLORS };
