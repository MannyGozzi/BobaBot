const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NjM4MTI4MzM1NTUzMTY3NDM4.XbYOcw.gAzcv9laiy2wjcfDRw6fEElC4MA';

bot.on('ready', () => {
  console.log('GorillaBot is online')
});

bot.on('message', msg => {
  if(msg.content === "gorilla") {
    msg.reply('gorilla is here');
  }
});

bot.login(token);