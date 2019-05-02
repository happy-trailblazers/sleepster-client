const inquirer = require('inquirer');

const finishedMessage = {
  type: 'list',
  name: 'finished',
  message: 'Download complete! Would you like to search again or quit?',
  choices: [
    { name: 'Search Again', value: 'search' },
    { name: 'Quit', value: 'quit' }
  ]
};

module.exports = async function finishedQuestion() {
  const { finished }  = await inquirer.prompt([finishedMessage]);
  if(finished === 'quit') {
    return process.exit();
  } else {
    return;
  }
};
