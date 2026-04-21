const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('docker')
    .setDescription('🐳 Generate Dockerfile and docker-compose.yml for your stack')
    .addStringOption(o => o.setName('stack').setDescription('Describe your app stack (e.g. Node.js + MongoDB + Redis)').setRequired(true).setMaxLength(500)),

  async execute(interaction) {
    const stack = interaction.options.getString('stack');
    await runAICommand(interaction, {
      system: `You are HeroX Docker Expert. Generate production-ready Docker configuration.
Provide:
1. **Dockerfile** — multi-stage build, optimized layers, non-root user
2. **docker-compose.yml** — all services with health checks, volumes, env vars
3. **.dockerignore** — essential exclusions
4. **Quick start commands** — how to build and run`,
      userMsg: `Stack: ${stack}`,
      title: '🐳 Docker Configuration',
      color: COLORS.code,
    });
  }
};
