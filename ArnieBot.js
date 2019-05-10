const Discord = require('discord.js');
const auth = require('./auth.json');


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
  if (msg.content.charAt(0) !== '$') return;

  const args = msg.content.substring(1).split(' ');
  const command = args[0];

  if (command === 'ping') {
    msg.reply('pong');
  } else if (command === 'kill') {
    if (!args[1]) {
      msg.reply('Oops! You didn\'t specify a target! Hopefully you weren\'t trying to kill yourself.');
    }
    console.log(msg.mentions.members.first());
    msg.reply(`Congrats! You have succesfully committed first degree murder by killing ${args[1]}!`);
  } else if (command === 'help' || command === '?') {
    replyString = formatHelp();
    msg.reply(replyString);
  } else {
    msg.reply('Oops! Unknown command input - please try again!');
  }
});

client.login(auth.token);
