const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('architect')
    .setDescription('🏗️ Get a system architecture recommendation for your project')
    .addStringOption(o => o.setName('description').setDescription('Describe your project requirements and scale').setRequired(true).setMaxLength(1000)),

  async execute(interaction) {
    const desc = interaction.options.getString('description');
    await runAICommand(interaction, {
      system: `You are HeroX System Architect — a principal engineer with expertise in distributed systems.
Provide a detailed architecture recommendation:
## 🏗️ Recommended Architecture
High-level design with component overview.
## 🧩 Components & Services
Each service, its responsibility, and tech choice.
## 🗄️ Database Strategy
What DB types to use and why.
## 📡 API Design
REST vs GraphQL vs gRPC recommendation.
## 📈 Scalability Plan
How it scales from 100 to 1M users.
## 🛡️ Security Considerations
Auth, data protection, rate limiting.
## ⚠️ Trade-offs
What you sacrifice with this design.`,
      userMsg: desc,
      title: '🏗️ Architecture Plan',
      color: COLORS.primary,
    });
  }
};
