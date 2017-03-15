var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Server endpoint for messages
server.post('/api/messages', connector.listen());

// Create console chat bot
// var connector = new builder.ConsoleConnector().listen();

// Manage the conversation with the UniversalBot
var bot = new builder.UniversalBot(connector);

//=========================================================
// Cognitive Services URL endpoint https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c413b2ef-382c-45bd-8ff0-f76d60e2a821?subscription-key=75166efbce1e4092a228ac3fcacacf46&q=
//=========================================================

//=========================================================
// Bots Dialogs
//=========================================================

// Determining the users intent
var intents = new builder.IntentDialog();

bot.dialog('/', intents);

intents.matches(/^change name/i, [
  function (session) {
    session.beginDialog('/profile');
  },
  function (session, results) {
    session.send("Ok, I've changed your name to %s", session.userData.name);
  }
]);

intents.onDefault([
  function (session, args, next) {
    if (!session.userData.name) {
      session.beginDialog('/profile');
    } else {
      next();
    }
  },
  function (session, results) {
    session.send('Hello %s!', session.userData.name);
  }
]);

bot.dialog('/profile', [
    function (session) {
      builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
      session.userData.name = results.response;
      session.endDialog();
    }
]);
