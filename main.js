const { Api } = require('./api')
const cli = require('./cli')

const initialInput = process.argv[1] || "Hello";
const api = new Api();

let inputChoices = [];

const continueConv = async input => {
  const conv = await api.getConv(input)
  conv.messages.forEach(message => {
    // console.log('inputChoices', inputChoices);
    inputChoices = cli.displayMessage(message, inputChoices);
  });
  if (conv.conversation_end) return
  let userInput = await cli.askQuestion();
  if (userInput && !isNaN(parseInt(userInput)) && parseInt(userInput) <= inputChoices.length)
    userInput = inputChoices[userInput - 1].title;
  inputChoices = [];
  return continueConv(userInput);
};

// (async () => {
  return continueConv(initialInput);
// })();
