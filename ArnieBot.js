const Discord = require('discord.js');
const auth = require('./auth.json');


let client = new Discord.Client();

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', msg => {
  if (msg.content.charAt(0) !== '$') return;

  const args = msg.content.substring(1).split(' ');
  const command = args[0]

  if (command === 'ping')
    msg.reply('pong');
  else if (command === 'kill') {
    if (!args[1])
      msg.reply('Oops! You didn\'t specify a target! Hopefully you weren\'t trying to kill yourself.');
    console.log(msg.mentions.members.first());
    msg.reply(`Congrats! You have succesfully committed first degree murder by killing ${args[1]}!`)
  }
  else if (command === 'help')
    msg.reply('Not yet implemented!');
  else
    msg.reply('Oops! Unknown command input - please try again!')
});

client.login(auth.token);
