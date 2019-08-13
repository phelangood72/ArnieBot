const winston = require('../config/winston.js');
const fs = require('fs');
const CONST = require('../const.js');
const axios = require('axios');

const path = './auth.json';
if (fs.existsSync(path)) {
  authJson = require('../auth.json');
  githubToken = authJson.githubToken;
} else {
  githubToken = process.env.GITHUB_TOKEN;
}

function newFeature(command, author){
  var matches = command.match(CONST.newFeatureRE);
  // First match is the whole string, second match is called vs. named
  var featureTitle = matches[2];
  var featureDescription = matches[3];
  featureDescription = `
  \'${featureDescription}\'
  -
  ${author}
  `;
  // Make Issue with GitHub API v3
  axios.post('https://api.github.com/repos/phelangood72/ArnieBot/issues',
    { // Data
      'title': featureTitle,
      'body': featureDescription,
      'labels': [
        'enhancement'
      ]
    },
    { // Config
      'headers': {
        'Authorization': 'token ' + githubToken
      }
    }).then(function(response) {
      winston.info('[newFeature] %s', response);
    }).catch(function(error) {
      winston.error('[newFeature] %s', error);
    });
  return `A feature request for \'${featureTitle}\' has been created.`;
}

module.exports = newFeature;
