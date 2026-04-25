require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./src/utils/logger');

// ── Validate env ──────────────────────────────────────────────────
const missing = ['BOT_TOKEN', 'CLIENT_ID'].filter(k => !process.env[k]);
if (missing.length) {
  logger.error(`Missing env vars: ${missing.join(', ')} — copy .env.example to .env`);
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.commands = new Collection();

// ── Load commands ─────────────────────────────────────────────────
const cmdPath = path.join(__dirname, 'src', 'commands');
let loaded = 0;
for (const file of fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'))) {
  try {
    const cmd = require(path.join(cmdPath, file));
    if (cmd.data && cmd.execute) { client.commands.set(cmd.data.name, cmd); loaded++; }
  } catch (e) { logger.warn(`Skip ${file}: ${e.message}`); }
}

// ── Events ────────────────────────────────────────────────────────
client.once('ready', () => {
  logger.success(`🤖 HeroX AI online as ${client.user.tag} | ${loaded} commands | ${client.guilds.cache.size} guild(s)`);

  const statuses = [
    { name: '⚡ /help • HeroX AI Agent', type: ActivityType.Playing },
    { name: '🧠 Powering developers worldwide', type: ActivityType.Watching },
    { name: '🎨 /imagine • AI Image Gen', type: ActivityType.Playing },
    { name: '🎬 /videogen • AI Video Gen', type: ActivityType.Watching },
    { name: '💻 35+ Developer Commands', type: ActivityType.Playing },
  ];
  let i = 0;
  const setStatus = () => client.user.setPresence({ activities: [statuses[i++ % statuses.length]], status: 'online' });
  setStatus();
  setInterval(setStatus, 30_000);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  logger.cmd(interaction.user.tag, `/${interaction.commandName}`);
  try {
    await cmd.execute(interaction, client);
  } catch (err) {
    logger.error(`[/${interaction.commandName}] ${err.message}`);
    const msg = { content: `❌ **Error:** \`${err.message}\`\n💡 Check your API key with \`/mymodel\``, ephemeral: true, embeds: [] };
    try {
      interaction.replied || interaction.deferred
        ? await interaction.editReply(msg)
        : await interaction.reply(msg);
    } catch { /* expired */ }
  }
});

client.on('error', e => logger.error(`Client: ${e.message}`));
process.on('unhandledRejection', e => logger.error(`Unhandled: ${e?.message || e}`));
process.on('uncaughtException', e => { logger.error(`Uncaught: ${e.message}`); process.exit(1); });

logger.info('🚀 Starting HeroX AI Bot...');
client.login(process.env.BOT_TOKEN).catch(e => {
  logger.error(`Login failed: ${e.message} — check BOT_TOKEN`);
  process.exit(1);
});

// ── Web Server for Free Hosting & Status Dashboard ──────────────
const http = require('http');
const port = process.env.PORT || 3000;

http.createServer((req, res) => {
  // API endpoint for live uptime & config
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ 
      uptime: process.uptime(),
      discordLink: process.env.DISCORD_LINK || 'https://discord.com',
      githubLink: process.env.GITHUB_LINK || 'https://github.com'
    }));
    return;
  }

  // Serve the logo image
  if (req.url === '/herox_logo.png') {
    const logoPath = path.join(__dirname, 'herox_logo.png');
    fs.readFile(logoPath, (err, data) => {
      if (!err) {
        res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
        res.end(data);
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    return;
  }

  // Serve the external premium HTML file
  const indexPath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(indexPath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error: Failed to load public/index.html. Please ensure the file exists.');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}).listen(port, () => {
  logger.info(`🌐 Web server active on port ${port} (Premium Status Page)`);
});
