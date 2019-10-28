const Constants = require('./Constants.js');
const info = 
`
Bot: ${Constants.botName}
Version: ${Constants.version}
Dev: ${Constants.dev.name}
`;

const handleInfo = function(msg) {
  msg.channel.sendMessage(info);
}

module.exports = handleInfo;