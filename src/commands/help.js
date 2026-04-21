const { SlashCommandBuilder } = require('discord.js');
const { base, COLORS } = require('../utils/embed');

const COMMANDS = [
  { cat: '🔑 Setup',        cmds: [
    ['setkey',       'Connect your AI provider (OpenRouter FREE, OpenAI, Anthropic, Gemini)'],
    ['setimagekey',  'Add Stability AI or Runway ML key for images/video'],
    ['mymodel',      'View your current provider and capabilities'],
    ['removekey',    'Delete your stored API key'],
  ]},
  { cat: '🤖 AI Core',      cmds: [
    ['ask',          'Ask any development question'],
    ['codegen',      'Generate code from a description'],
    ['fix',          'Fix a bug — describe the issue and paste code'],
    ['explain',      'Explain code line-by-line (beginner/expert level)'],
    ['debug',        'Analyze error/stack trace and get a fix'],
    ['chat',         'Start an ongoing AI conversation thread'],
  ]},
  { cat: '🔍 Code Quality', cmds: [
    ['review',       'Full code review (bugs, perf, security, best practices)'],
    ['optimize',     'Optimize for performance, memory, or readability'],
    ['refactor',     'Refactor to SOLID, DRY, clean code principles'],
    ['security',     'OWASP security audit with severity levels'],
    ['complexity',   'Analyze Big-O time and space complexity'],
    ['test',         'Generate unit tests (Jest, PyTest, JUnit, etc.)'],
  ]},
  { cat: '📄 Docs & Git',   cmds: [
    ['docs',         'Generate JSDoc / Python docstrings / Javadoc'],
    ['commit',       'Generate conventional commit messages'],
    ['readme',       'Generate a professional README.md'],
    ['changelog',    'Generate CHANGELOG.md entry'],
    ['gitignore',    'Generate .gitignore for your stack'],
  ]},
  { cat: '🛠️ Dev Tools',    cmds: [
    ['sql',          'Generate SQL queries (Postgres, MySQL, MongoDB)'],
    ['docker',       'Generate Dockerfile + docker-compose'],
    ['cicd',         'Generate CI/CD pipeline (GitHub Actions, GitLab, etc.)'],
    ['api',          'Design a REST API with endpoints and schemas'],
    ['schema',       'Generate DB schema (Prisma, Mongoose, SQL, TypeORM)'],
    ['regex',        'Generate and explain regex patterns'],
    ['convert',      'Convert code between languages'],
    ['snippet',      'Quick focused code snippet'],
    ['mock',         'Generate realistic mock/test data'],
  ]},
  { cat: '🧠 Knowledge',    cmds: [
    ['algorithm',    'Explain and implement algorithms'],
    ['design',       'Explain design patterns with code examples'],
    ['architect',    'Get a system architecture recommendation'],
    ['stack',        'Get a tech stack recommendation'],
    ['interview',    'Interview Q&A for any topic and level'],
    ['brainstorm',   'Generate ideas for features, names, projects'],
    ['summarize',    'Summarize long articles or documentation'],
  ]},
  { cat: '🎨 AI Generation', cmds: [
    ['imagine',      'Generate AI images (DALL-E 3 or Stability AI)'],
    ['videogen',     'Generate AI videos (Runway ML Gen-3)'],
  ]},
  { cat: '⚙️ Utility',      cmds: [
    ['ping',         'Check bot latency'],
    ['status',       'View bot stats and your account'],
    ['help',         'Show this help menu'],
  ]},
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 Show all HeroX commands and how to get started'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const fields = COMMANDS.map(({ cat, cmds }) => ({
      name:   cat,
      value:  cmds.map(([name, desc]) => `\`/${name}\` — ${desc}`).join('\n'),
      inline: false,
    }));

    const embed = base(COLORS.primary)
      .setTitle('🤖 HeroX AI — Complete Command Reference')
      .setDescription([
        '**Welcome to HeroX** — Your AI Developer Agent!',
        '',
        '**Quick Start:**',
        '1. `/setkey provider:openrouter api_key:sk-or-...` ← 🆓 FREE option',
        '2. Try `/ask`, `/codegen`, or `/imagine`',
        '',
        '> 🔒 All API keys are encrypted with AES-256-GCM.',
        '> 💡 Get a free OpenRouter key at **openrouter.ai**',
      ].join('\n'))
      .addFields(fields);

    await interaction.editReply({ embeds: [embed] });
  }
};
