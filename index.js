const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NjM4MTI4MzM1NTUzMTY3NDM4.XbYOcw.gAzcv9laiy2wjcfDRw6fEElC4MA';
const botName = 'GorillBot';
const botVersion = '1.0.0';
const dev = {
  name: 'Noctua',
  age: 17,
  gender: 'Whale'
};

bot.on('ready', () => {
  console.log('GorillaBot is online')
});

bot.on('message', msg => {
  if(msg.content.toLowerCase() === "gorilla") {
    msg.channel.sendMessage('I think you meant scalene');
  } 
  else if(msg.content.substring(0, 1) === prefix) {
    const args = msg.content.substring(prefix.length).split(' ');
    switch(args[0]) {
      case 'info':
        msg.channel.sendMessage(
          `===================
          Version: ${botVersion}
          Name: ${dev.name}
          Dev: ${dev.name}
          Age: ${dev.age}
          Gender: ${dev.gender}
          `);
    }
  }
});

// this logs the bot into Discord and updates all functionality
// if the token is stolen then request a new one on the dev site
bot.login(token);