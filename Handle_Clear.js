// args[1] is the # of messages to delete
const handleClear = function(msg, args) {
  if(!args[1]) return msg.channel.sendMessage('Please specify # of messages to delete');
  msg.channel.bulkDelete(args[1] + 1);  // +1 because this creates a message itself
}

module.exports = handleClear;