// args[1] is the # of messages to delete
const handleClear = function(msg, args) {
  if(!args[1]) return msg.channel.sendMessage('Please specify # of messages to delete');
  msg.channel.bulkDelete(args[1] + 1)   // +1 because this creates a message itself
    .then(() => msg.channel.sendMessage(`Cleared ${args[1]} messages`))
    .catch(e => msg.channel.sendMessage(`Error: you are attempting to clear more messages than those that exist`));
}

module.exports = handleClear;