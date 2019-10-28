// node doesn't support import statements so we're stuck with require
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NjM4MTI4MzM1NTUzMTY3NDM4.XbYOcw.gAzcv9laiy2wjcfDRw6fEElC4MA';
const handleInfo = require('./Handle_Info.js');
const handleClear = require('./Handle_Clear.js');
const Constants = require('./Constants.js');

// FUNCTIONALITY
bot.on('ready', () => {
  console.log('GorillaBot is online')
});


bot.on('message', msg => {
  if(msg.content.toLowerCase() === "gorilla") {
    msg.channel.sendMessage('I think you meant scalene');
  } else if(msg.content.substring(0, 1) === Constants.prefix) {
    const args = msg.content.substring(Constants.prefix.length).split(' ');
    switch(args[0]) {
      case 'info':
        handleInfo(msg);
        break;
      case 'clear':
        handleClear(msg, args);
        break;
    }
  }
});

// this logs the bot into Discord and updates all functionality
// if the token is stolen then request a new one on the dev site
bot.login(token);