const chalk = require('chalk');
const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });

module.exports = {
  info:    m => console.log(`${chalk.gray(ts())} ${chalk.blueBright('[INFO] ')} ${m}`),
  success: m => console.log(`${chalk.gray(ts())} ${chalk.greenBright('[OK]   ')} ${m}`),
  warn:    m => console.log(`${chalk.gray(ts())} ${chalk.yellow('[WARN] ')} ${m}`),
  error:   m => console.log(`${chalk.gray(ts())} ${chalk.redBright('[ERR]  ')} ${m}`),
  cmd:  (u, c) => console.log(`${chalk.gray(ts())} ${chalk.magentaBright('[CMD]  ')} ${chalk.cyan(u)} → ${chalk.yellow(c)}`),
};
