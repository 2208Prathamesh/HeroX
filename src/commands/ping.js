const { SlashCommandBuilder } = require('discord.js');
const { base, COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Check HeroX bot latency and status'),

  async execute(interaction, client) {
    const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    const getStatus = (ms) => ms < 100 ? '🟢 Excellent' : ms < 200 ? '🟡 Good' : ms < 400 ? '🟠 Fair' : '🔴 Poor';

    await interaction.editReply({
      content: null,
      embeds: [
        base(COLORS.success)
          .setTitle('🏓 Pong!')
          .addFields(
            { name: '📡 Round-trip Latency', value: `${latency}ms — ${getStatus(latency)}`,   inline: true },
            { name: '💓 API Latency',         value: `${apiLatency}ms — ${getStatus(apiLatency)}`, inline: true },
            { name: '⚡ Status',               value: '🟢 Online',                              inline: true },
          )
      ]
    });
  }
};
