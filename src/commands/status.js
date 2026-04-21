const { SlashCommandBuilder } = require('discord.js');
const { base, COLORS } = require('../utils/embed');
const { hasKey, getKey } = require('../utils/keystore');
const { PROVIDERS } = require('../providers');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('📊 Show HeroX bot status and your account info'),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const uptime  = process.uptime();
    const hours   = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const memUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    const kd      = getKey(interaction.user.id);
    const provider = kd ? PROVIDERS[kd.provider] : null;

    await interaction.editReply({
      embeds: [
        base(COLORS.primary)
          .setTitle('📊 HeroX Status Dashboard')
          .setThumbnail(client.user.displayAvatarURL())
          .addFields(
            { name: '🤖 Bot',        value: `${client.user.tag}`,                                        inline: true  },
            { name: '⚡ Latency',    value: `${client.ws.ping}ms`,                                        inline: true  },
            { name: '🌐 Guilds',     value: `${client.guilds.cache.size}`,                                inline: true  },
            { name: '⏱️ Uptime',     value: `${hours}h ${minutes}m ${seconds}s`,                         inline: true  },
            { name: '💾 Memory',     value: `${memUsed} MB`,                                              inline: true  },
            { name: '🟢 Node.js',    value: process.version,                                              inline: true  },
            { name: '👤 Your Model', value: provider ? `${provider.emoji} ${provider.name}` : '❌ Not set — use `/setkey`', inline: false },
            { name: '📦 Commands',   value: `${client.commands.size} loaded`,                             inline: true  },
          )
          .setFooter({ text: `🤖 HeroX AI — Running on ${os.platform()} | Node ${process.version}` })
      ]
    });
  }
};
