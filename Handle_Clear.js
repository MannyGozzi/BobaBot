cosnt 
if(!args[1]) return msg.channel.sendMessage('Please specify # of messages to delete');
  msg.channel.bulkDelete(args[1]);