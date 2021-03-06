const Discord = require('discord.js');
const fs = require('fs');
const winston = require('./config/winston.js'); // Logger
const MongoClient = require('mongodb').MongoClient;
const CONST = require('./const.js');

// Command importing
const newFeature = require('./commands/newFeature.js');
const path = './auth.json';
var token = '';
var dbUsername;
var dbPassword;
const botLords = []; // "Admins"
// Use json for local and environment variables for Heroku
if (fs.existsSync(path)) {
  authJson = require('./auth.json');
  token = authJson.token;
  botLords.push(authJson.thomas_id);
  botLords.push(authJson.alex_id);

  dbUsername = authJson.dbUser;
  dbPassword = authJson.dbPassword
} else {
  token = process.env.TOKEN;
  botLords.push(process.env.THOMAS_ID);
  botLords.push(process.env.ALEX_ID);

  dbUsername = process.env.DBUSERNAME;
  dbPassword = process.env.DPBPASSWORD;
}

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@arniebot-smese.mongodb.net/test?retryWrites=true&w=majority`;
//const uri = 'mongodb://localhost:27017';
const dbClient = new MongoClient(uri, { useNewUrlParser: true });
dbClient.connect(err => {
  const collection = dbClient.db("test").collection("devices");
  // perform actions on the collection object
  dbClient.close();
});

function formatHelp(){
  const replyString = `
    I'm ArnieBot!

    Here's a list of things I can do!

    \`\`\`
    Help:
      Output this helpful information about what I can do!

      Aliases: $?
      Usage: $help
    \`\`\`
    \`\`\`
    Kill:
      Commit murder on one of the other members of the current
      channel!

      Aliases: None
      Usage: $kill [user]
      Example: $kill @username
    \`\`\`
    \`\`\`
    New Feature:
      Ask for a new feature in ArnieBot!

      Aliases: None
      Usage: Arnie I want a new feature called *feature name* that *description of what the new feature does*
    \`\`\`
    \`\`\`
    Ping:
      Make sure I'm working with a quick game of ping pong!

      Aliases: None
      Usage: $ping
    \`\`\`
  `;
  return replyString;
}

let client = new Discord.Client();

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', msg => {
  var isCommand = msg.content.charAt(0) === '$';
  var isTestCommand = false;
  isCommand = isCommand ||
    msg.content.toLowerCase().startsWith('arnie');
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
  // Only certain people should be able to use test commands
  admin = botLords.includes(msg.author.id)

  const command = findCommand;
  if (!command) {
    msg.reply('You need to tell me what to do. Try \'$help\' or \'Arnie help\' to learn what I can do.');
    return;
  }

  // Trying to be a good dev and log
  winston.info('Command \'%s\' from %s: %s', command, msg.author.username, msg.author.id);

  /*
  *   This area is for testing commands in a deployment.
  */

  if (admin) {
    if (CONST.newFeatureRE.test(command)) {
      isTestCommand = true;
      var replyString = newFeature(command, msg.author.username);
      msg.reply(replyString);
    }
  }

  /*
  *   This area is for production ready commands.
  */

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
    // Don't want to this see if we're using a test command
    if (!isTestCommand) {
      msg.reply('Oops! Unknown command input - please try again!');
    }
  }
});

try {
  client.login(token);
} catch (e) {
  winston.debug(e)
  winston.debug('You probably have the wrong Discord API key.')
}
