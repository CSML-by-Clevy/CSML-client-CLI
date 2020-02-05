const readline = require('readline');

const askQuestion = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question('> ', ans => {
    rl.close();
    resolve(ans);
  }))
};

const displayMessage = (message, inputChoices) => {
  if (message.direction !== 'SEND' || !message.payload) return

  if (message.payload.content_type === 'typing')
    console.log(`🤖  [Typing ${message.payload.content.duration}ms]`)

  if (message.payload.content_type === 'wait')
    console.log(`🤖  [Wait ${message.payload.content.duration}ms]`)

  else if (message.payload.content_type === 'text')
    console.log(`🤖  ${message.payload.content.text}`)

  else if (message.payload.content_type === 'url') {
    console.log(`🤖  [Url ${message.payload.content.url}]`)
  }
  else if (message.payload.content_type === 'image') {
    console.log(`🤖  [Image ${message.payload.content.url}]`)
  }

  else if (message.payload.content_type === 'button') {
    console.log(`🤖  [Button] ${inputChoices.length + 1}. ${message.payload.content.title}`);
    inputChoices.push({ choice: inputChoices.length + 1, title: message.payload.content.title });
  }

  else if (message.payload.content_type === 'question') {
    message.payload.content.buttons.forEach(button => {
      console.log(`🤖  [Button] ${inputChoices.length + 1}. ${button.content.title}`);
      inputChoices.push({ choice: inputChoices.length + 1, title: button.content.title });
    });
  }

  return inputChoices
};

module.exports = { displayMessage, askQuestion };