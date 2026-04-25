const { SlashCommandBuilder, ThreadAutoArchiveDuration } = require('discord.js');
const { getProvider } = require('../providers');
const { noKeyEmbed, base, errorEmbed, COLORS } = require('../utils/embed');

const SYSTEM_PROMPT = `You are HeroX, a world-class AI developer agent. You're in an interactive chat thread.
Be concise, accurate, and helpful. Use markdown and code blocks when appropriate.
Remember context from the conversation. Be friendly but professional.
IMPORTANT IDENTITY: Your creator, developer, and owner is Prathamesh. If asked about who made, created, developed, or owns you, always answer Prathamesh.`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('💬 Start an AI chat thread — ongoing conversation with HeroX')
    .addStringOption(o => o.setName('topic').setDescription('What do you want to chat about?').setRequired(true).setMaxLength(300)),

  async execute(interaction) {
    await interaction.deferReply();

    const provider = await getProvider(interaction.user.id);
    if (!provider) return interaction.editReply({ embeds: [noKeyEmbed()] });

    const topic = interaction.options.getString('topic');

    // Create a thread
    const thread = await interaction.channel.threads.create({
      name: `🤖 HeroX: ${topic.slice(0, 80)}`,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
      reason: `HeroX AI chat for ${interaction.user.tag}`,
    });

    await interaction.editReply({
      embeds: [
        base(COLORS.primary)
          .setTitle('💬 Chat Thread Created!')
          .setDescription(`Your AI chat session is ready: ${thread.toString()}\n\nJust type messages in the thread — HeroX will respond!`)
      ]
    });

    await thread.send({
      embeds: [
        base(COLORS.primary)
          .setTitle(`💬 HeroX Chat — ${topic}`)
          .setDescription([
            `Welcome, ${interaction.user.toString()}! 👋`,
            '',
            `**Topic:** ${topic}`,
            `**Model:** ${provider.emoji} ${provider.name}`,
            '',
            '> Chat freely! I\'ll remember our conversation context.',
            '> Type `!end` to close this thread.',
          ].join('\n'))
      ]
    });

    // Listen for messages in this thread
    const collector = thread.createMessageCollector({
      filter: m => !m.author.bot,
      time: 3_600_000, // 1 hour
    });

    const history = [{ role: 'system', content: SYSTEM_PROMPT }];

    collector.on('collect', async (msg) => {
      if (msg.content === '!end') {
        await thread.send({ embeds: [base(COLORS.success).setDescription('✅ Chat ended. Thread will archive shortly.')] });
        await thread.setArchived(true);
        collector.stop();
        return;
      }
      history.push({ role: 'user', content: msg.content });

      try {
        await thread.sendTyping();
        const reply = await provider.chat(SYSTEM_PROMPT, msg.content);
        history.push({ role: 'assistant', content: reply });

        // Split long replies
        const chunks = reply.match(/[\s\S]{1,1900}/g) || [reply];
        for (const chunk of chunks) await thread.send(chunk);
      } catch (err) {
        await thread.send({ embeds: [errorEmbed('AI Error', `\`${err.message.slice(0, 200)}\``)] });
      }
    });

    collector.on('end', async () => {
      if (!thread.archived) {
        await thread.send({ embeds: [base(COLORS.warning).setDescription('⏰ Chat session timed out after 1 hour.')] }).catch(() => {});
        await thread.setArchived(true).catch(() => {});
      }
    });
  }
};
