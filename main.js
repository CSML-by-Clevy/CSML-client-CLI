#!/usr/bin/env node

require('dotenv').config();
global.Promise = require('bluebird');

const path = require('path');
const uuidv4 = require('uuid/v4');
const commander = require('commander');
const asciify = require('asciify-image');
const cli = require('./cli')
const { Api } = require('./api')
const { displayImage } = require('./helpers');

const program = new commander.Command();

program
  .version('0.0.1')
  .option('-d, --debug', 'output extra debugging')
  .option('-k, --key <value>', 'CSML studio API key', process.env.CSML_API_CLIENT_KEY)
  .option('-s, --secret <value>', 'CSML studio API secret', process.env.CSML_API_SECRET_KEY)
  .option('-u, --user <value>', 'unique user id', process.env.CSML_USER_ID || uuidv4());

program.parse(process.argv);

if (program.debug) console.log(program.opts());

const api = new Api(program.key, program.secret, program.user);

let inputChoices = [];

const continueConv = async (input) => {
  const conv = await api.getConv(input)
  await Promise.each(conv.messages, async message => {
    inputChoices = await cli.displayMessage(message, inputChoices);
  });
  if (conv.conversation_end) {
    console.log("--- End of conversation ---");
  }
  let userInput = await cli.askQuestion();
  if (userInput && !isNaN(parseInt(userInput)) && parseInt(userInput) <= inputChoices.length)
    userInput = inputChoices[userInput - 1].title;
  inputChoices = [];
  return continueConv(userInput);
};

(async () => {
  await displayImage(path.join(__dirname, 'images/logo.png'));

  console.log("--- Starting conversation with CSML bot ---");
  console.log("press ctrl+C to exit");

  const initialInput = await cli.askQuestion();
  continueConv(initialInput);
})();

