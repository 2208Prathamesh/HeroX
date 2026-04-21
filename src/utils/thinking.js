const { EmbedBuilder } = require('discord.js');

const FRAMES = ['🧠', '💭', '⚡', '🔮', '✨', '🌟', '💡', '🔥'];

/**
 * Sends an animated "thinking" embed and returns a stop function.
 * Call stop() when the AI response is ready.
 */
async function startThinking(interaction, message = 'Processing your request', color = 0x5865F2) {
  let frame = 0, elapsed = 0;

  const makeEmbed = () => new EmbedBuilder()
    .setColor(color)
    .setDescription(`${FRAMES[frame]} **${message}...**\n\n> ⏱️ ${elapsed}s elapsed`)
    .setFooter({ text: '🤖 HeroX AI is working hard for you...' });

  await interaction.editReply({ embeds: [makeEmbed()], files: [] });

  const timer = setInterval(async () => {
    elapsed += 2;
    frame = (frame + 1) % FRAMES.length;
    try { await interaction.editReply({ embeds: [makeEmbed()] }); }
    catch { /* rate limit / expired — ignore */ }
  }, 2000);

  return () => clearInterval(timer);
}

module.exports = { startThinking };
