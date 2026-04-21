const { SlashCommandBuilder } = require('discord.js');
const { getImageKey } = require('../utils/keystore');
const { errorEmbed, base, COLORS } = require('../utils/embed');
const { startThinking } = require('../utils/thinking');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('videogen')
    .setDescription('🎬 Generate a short AI video from a text prompt (Runway ML)')
    .addStringOption(o => o.setName('prompt').setDescription('Describe the video scene you want').setRequired(true).setMaxLength(500))
    .addStringOption(o => o.setName('duration').setDescription('Duration').setRequired(false)
      .addChoices(
        { name: '5 seconds', value: '5' },
        { name: '10 seconds', value: '10' },
      )),

  async execute(interaction) {
    await interaction.deferReply();

    const prompt   = interaction.options.getString('prompt');
    const duration = parseInt(interaction.options.getString('duration') || '5');
    const imageKey = getImageKey(interaction.user.id);

    if (!imageKey || imageKey.provider !== 'runway') {
      return interaction.editReply({
        embeds: [errorEmbed('Runway ML Key Required',
          'Video generation uses **Runway ML Gen-3 Alpha**.\n\n**Setup:**\n1. Get a free API key at [app.runwayml.com](https://app.runwayml.com)\n2. Run `/setimagekey provider:runway api_key:your-key`\n3. Then use `/videogen` again!')]
      });
    }

    const stop = await startThinking(interaction, '🎬 Generating your video (may take 1-2 min)', COLORS.video);

    try {
      // Step 1: Create generation task
      const createRes = await fetch('https://api.runwayml.com/v1/text_to_video', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${imageKey.apiKey}`,
          'X-Runway-Version': '2024-11-06',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptText: prompt, model: 'gen3a_turbo', duration, ratio: '1280:768' }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        throw new Error(`Runway API: ${errText}`);
      }

      const { id: taskId } = await createRes.json();

      // Step 2: Poll for completion (max 3 min)
      let videoUrl = null;
      const maxAttempts = 36; // 36 * 5s = 3min
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const pollRes = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${imageKey.apiKey}`, 'X-Runway-Version': '2024-11-06' },
        });
        const task = await pollRes.json();
        if (task.status === 'SUCCEEDED') { videoUrl = task.output?.[0]; break; }
        if (task.status === 'FAILED')    { throw new Error(`Generation failed: ${task.failure || 'Unknown error'}`); }
      }

      stop();
      if (!videoUrl) throw new Error('Generation timed out after 3 minutes.');

      await interaction.editReply({
        embeds: [
          base(COLORS.video)
            .setTitle('🎬 Video Generated!')
            .setDescription([
              `**Prompt:** ${prompt}`,
              `**Duration:** ${duration}s`,
              '',
              `> 🎥 **[Click to watch your video](${videoUrl})**`,
              '',
              `> 💾 Right-click the link above to download.`,
            ].join('\n'))
            .addFields(
              { name: '⏱️ Duration', value: `${duration}s`,    inline: true },
              { name: '📐 Resolution', value: '1280×768',       inline: true },
              { name: '🔧 Model',    value: 'Runway Gen-3 Alpha Turbo', inline: true }
            )
        ]
      });
    } catch (err) {
      stop();
      await interaction.editReply({
        embeds: [errorEmbed('Video Generation Failed', `\`${err.message.slice(0, 300)}\`\n\nCheck your Runway API key with \`/mymodel\`.`)]
      });
    }
  }
};
