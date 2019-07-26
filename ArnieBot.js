const Discord = require('discord.js');
const fs = require('fs');

const path = './auth.json';
var auth = ''
if (fs.existsSync(path)) {
  auth = require('./auth.json');
} else {
  auth = process.env.TOKEN;
}

function formatHelp(){
  const replyString = `
    I'm ArnieBot!

    Here's a list of things I can do!
    -------------------------------------------------------------
    Help:
      Output this helpful information about what I can do!

      Aliases: $?
      Usage: $help
    -------------------------------------------------------------
    Kill:
      Commit murder on one of the other members of the current
      channel!

      Aliases: None
      Usage: $kill [user]
      Example: $kill @username
    -------------------------------------------------------------
    Ping:
      Make sure I'm working with a quick game of ping pong!

      Aliases: None
      Usage: $ping
    -------------------------------------------------------------
  `;
  return replyString;
}

let client = new Discord.Client();

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', msg => {
  var isCommand = msg.content.charAt(0) === '$';
  isCommand = isCommand || msg.content.toLowerCase().startsWith('arnie');
  if (!isCommand) return;

  var findCommand = '';
  if (msg.content.charAt(0) === '$') {
    var args = msg.content.substring(1).split(' ');
    findCommand = args[0];
  } else if (msg.content.toLowerCase().startsWith('arnie')) {
    var args = msg.content.split(' ');
    args.shift();
    findCommand = args.join(' ');
  }

  const command = findCommand;
  if (!command) {
    msg.reply('You need to tell me what to do. Try \'$help\' or \'Arnie help\' to learn what I can do.');
    return;
  }

  if (command === 'ping') {
    msg.reply('pong');
  } else if (command === 'kill') {
    if (!args[1]) {
      msg.reply('Oops! You didn\'t specify a target! Hopefully you weren\'t trying to kill yourself.');
    }
    console.log(msg.mentions.members.first());
    msg.reply(`Congrats! You have succesfully committed first degree murder by killing ${args[1]}!`);
  } else if (command === 'what\'s in your mouth?') {
    msg.reply('*runs away*');
  } else if (command === 'help' || command === '?') {
    replyString = formatHelp();
    msg.reply(replyString);
  } else {
    msg.reply('Oops! Unknown command input - please try again!');
  }
});

client.login(auth.token);
