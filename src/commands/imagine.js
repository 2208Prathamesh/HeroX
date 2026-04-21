const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { getProvider } = require('../providers');
const { getImageKey } = require('../utils/keystore');
const { noKeyEmbed, errorEmbed, base, COLORS } = require('../utils/embed');
const { startThinking } = require('../utils/thinking');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('imagine')
    .setDescription('🎨 Generate an AI image from a text prompt')
    .addStringOption(o => o.setName('prompt').setDescription('Describe the image you want').setRequired(true).setMaxLength(1000))
    .addStringOption(o => o.setName('size').setDescription('Image size (OpenAI only)').setRequired(false)
      .addChoices(
        { name: '1024×1024 Square', value: '1024x1024' },
        { name: '1792×1024 Landscape', value: '1792x1024' },
        { name: '1024×1792 Portrait', value: '1024x1792' },
      ))
    .addStringOption(o => o.setName('style').setDescription('Image style (OpenAI only)').setRequired(false)
      .addChoices(
        { name: '🎨 Vivid (bold, dramatic)', value: 'vivid' },
        { name: '🖼️ Natural (realistic)', value: 'natural' },
      )),

  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('prompt');
    const size   = interaction.options.getString('size')  || '1024x1024';
    const style  = interaction.options.getString('style') || 'vivid';

    // Try OpenAI DALL-E 3 first (via main provider)
    const provider = await getProvider(interaction.user.id);
    const imageKey = getImageKey(interaction.user.id);

    if (!provider && !imageKey) {
      return interaction.editReply({ embeds: [noKeyEmbed()] });
    }

    const stop = await startThinking(interaction, '🎨 Generating your image', COLORS.image);

    try {
      let imageUrl, revisedPrompt;

      if (provider?.supportsImages && provider.generateImage) {
        // DALL-E 3 via OpenAI
        const res = await provider.generateImage(prompt, { size, style, quality: 'hd' });
        imageUrl      = res.url;
        revisedPrompt = res.revisedPrompt;
      } else if (imageKey?.provider === 'stability') {
        // Stability AI SDXL
        const res = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${imageKey.apiKey}` },
          body: JSON.stringify({ text_prompts: [{ text: prompt }], cfg_scale: 7, width: 1024, height: 1024, samples: 1, steps: 30 }),
        });
        if (!res.ok) throw new Error(`Stability AI error: ${await res.text()}`);
        const data    = await res.json();
        const imgData = data.artifacts[0].base64;
        const buf     = Buffer.from(imgData, 'base64');
        const file    = new AttachmentBuilder(buf, { name: 'herox-image.png' });
        stop();
        return interaction.editReply({
          files: [file],
          embeds: [
            base(COLORS.image)
              .setTitle('🎨 Image Generated!')
              .setDescription(`**Prompt:** ${prompt}`)
              .setImage('attachment://herox-image.png')
              .addFields({ name: '🔧 Provider', value: 'Stability AI SDXL', inline: true })
          ]
        });
      } else {
        stop();
        return interaction.editReply({
          embeds: [errorEmbed('No Image Provider', [
            'To generate images you need one of:',
            '• **OpenAI key** (includes DALL-E 3) → `/setkey provider:openai`',
            '• **Stability AI key** → `/setimagekey provider:stability`',
          ].join('\n'))]
        });
      }

      stop();
      await interaction.editReply({
        embeds: [
          base(COLORS.image)
            .setTitle('🎨 Image Generated!')
            .setDescription(`**Prompt:** ${prompt}${revisedPrompt && revisedPrompt !== prompt ? `\n\n**AI Enhanced:** ${revisedPrompt}` : ''}`)
            .setImage(imageUrl)
            .addFields(
              { name: '📐 Size',  value: size,  inline: true },
              { name: '🎨 Style', value: style, inline: true },
              { name: '🔧 Model', value: 'DALL-E 3 HD', inline: true }
            )
        ]
      });
    } catch (err) {
      stop();
      await interaction.editReply({
        embeds: [errorEmbed('Image Generation Failed', `\`${err.message.slice(0, 300)}\`\n\nCheck your API key has image generation access.`)]
      });
    }
  }
};
