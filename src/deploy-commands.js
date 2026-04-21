require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const cmdPath = path.join(__dirname, 'commands');

for (const file of fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'))) {
  try {
    const cmd = require(path.join(cmdPath, file));
    if (cmd.data) { commands.push(cmd.data.toJSON()); console.log(`✓ ${cmd.data.name}`); }
  } catch (e) { console.error(`✗ ${file}: ${e.message}`); }
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`\n🚀 Registering ${commands.length} slash commands...`);
    const guildId = process.env.GUILD_ID;
    // Guild deploy = instant, global deploy = up to 1hr
    const route = guildId
      ? Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId)
      : Routes.applicationCommands(process.env.CLIENT_ID);

    await rest.put(route, { body: commands });
    console.log(`\n✅ Successfully registered ${commands.length} commands!`);
    console.log(guildId ? `   Mode: Guild (instant)` : `   Mode: Global (up to 1hr)`);
  } catch (e) {
    console.error(`\n❌ Failed: ${e.message}`);
    process.exit(1);
  }
})();
