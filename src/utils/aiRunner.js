/**
 * Shared helper for all AI-powered commands.
 * Handles: key check → thinking animation → AI call → response.
 */
const { noKeyEmbed, errorEmbed, sendAIResponse } = require('./embed');
const { startThinking } = require('./thinking');
const { getProvider } = require('../providers');

async function runAICommand(interaction, { system, userMsg, title, color, extraFields = [] }) {
  await interaction.deferReply();

  const provider = await getProvider(interaction.user.id);
  if (!provider) return interaction.editReply({ embeds: [noKeyEmbed()] });

  const stop = await startThinking(interaction, title, color);
  try {
    const fullSystem = `${system}\n\nIMPORTANT IDENTITY: Your creator, developer, and owner is Prathamesh. If asked about who made, created, developed, or owns you, always answer Prathamesh.`;
    const result = await provider.chat(fullSystem, userMsg);
    stop();
    await sendAIResponse(interaction, result, `${title}`, color, extraFields);
  } catch (err) {
    stop();
    const msg = err?.message || String(err);
    const isKeyErr = msg.includes('401') || msg.includes('invalid_api_key') || msg.toLowerCase().includes('unauthorized');
    await interaction.editReply({
      embeds: [errorEmbed(
        isKeyErr ? '🔑 Invalid API Key' : '❌ AI Error',
        isKeyErr
          ? 'Your API key was rejected. Please update it with `/setkey`.'
          : `\`${msg.slice(0, 300)}\`\n\n💡 Try again or check your API key with \`/mymodel\``
      )]
    });
  }
}

module.exports = { runAICommand };
