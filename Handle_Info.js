const Constants = require('./Constants.js');
const info = 
`
Bot: ${Constants.bot.name}
Version: ${Constants.bot.version}
Dev: ${Constants.dev.name}
Dev Age: ${Constants.dev.age}
Dev Species: ${Constants.dev.species}
`;

const handleInfo = function(msg) {
  msg.channel.sendMessage(info);
}

module.exports = handleInfo;