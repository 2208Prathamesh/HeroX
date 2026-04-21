const { SlashCommandBuilder } = require('discord.js');
const { runAICommand } = require('../utils/aiRunner');
const { COLORS } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('security')
    .setDescription('🔒 Security audit — find vulnerabilities in your code')
    .addStringOption(o => o.setName('code').setDescription('Paste code to audit').setRequired(true).setMaxLength(2000)),

  async execute(interaction) {
    const code = interaction.options.getString('code');
    await runAICommand(interaction, {
      system: `You are HeroX Security Auditor — an OWASP-certified security expert.
Audit code for vulnerabilities. Format:

## 🚨 Critical Vulnerabilities
Severity: CRITICAL — must fix immediately.

## ⚠️ High Risk Issues
Severity: HIGH — fix before production.

## 📋 Medium / Low Issues
Severity: MEDIUM/LOW — good to address.

## 🛡️ Secure Version
Provide a patched version of the code.

## 📚 References
OWASP or CVE references where relevant.`,
      userMsg: `Security audit:\n\`\`\`\n${code}\n\`\`\``,
      title: '🔒 Security Audit',
      color: COLORS.error,
    });
  }
};
