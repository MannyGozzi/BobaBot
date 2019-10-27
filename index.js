const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NjM4MTI4MzM1NTUzMTY3NDM4.XbYOcw.gAzcv9laiy2wjcfDRw6fEElC4MA';
const prefix = '!';

bot.on('ready', () => {
  console.log('GorillaBot is online')
});

bot.on('message', msg => {
  if(msg.content === "gorilla") {
    msg.reply(`i'm here`);
  }
});

// this logs the bot into Discord and updates all functionality
// if the token is stolen then request a new one on the dev site
bot.login(token);