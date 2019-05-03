const inquirer = require('inquirer');

const welcomeMessage = {
  type: 'list',
  name: 'welcome',
  message: 'Welcome to \x1b[36mSleepster!\x1b[39m\nPlease make sure you have installed and authorized ngrok before continuing.\nFull instructions can be found at ngrok.com',
  choices: [
    { name: '\x1b[32mContinue\x1b[0m', value: 'continue' },
    { name: 'Quit', value: 'quit' }
  ]
};

const saveFilePath = {
  type: 'input',
  message: 'Where do you want to save your downloads. Please specify an absolute file path.',
  name: 'savePath',
  validate: function(value) {
    const pass = value.startsWith('/');
    if(pass) {
      return true;
    } else {
      return 'Please enter a valid path starting with a /';
    }
  }
};

const iTunesOrFilePath = {
  type: 'list',
  name: 'shareChoice',
  message: 'How do you want to share your Music',
  choices: [ 
    { name: 'Share iTunes Library', value: 'iTunes' },
    { name: 'Specify a folder', value: 'folder' }
  ]
};

const clientUsername = {
  type: 'input',
  name: 'userName',
  message: 'Enter your OSX user name.'
};

const customSharedFilePath = {
  type: 'input',
  name: 'customSharedPath',
  message: 'Which folder would you like to share from? Please specify an absolute file path.',
  validate: function(value) {
    const pass = value.startsWith('/');
    if(pass) {
      return true;
    } else {
      return 'Please enter a valid path starting with a /';
    }
  }
};

module.exports = async function firstQuestions() {
  const { welcome }  = await inquirer.prompt([welcomeMessage]);
  if(welcome === 'quit') {
    return process.exit();
  } else {
    const { savePath } = await inquirer.prompt([saveFilePath]);
    const { shareChoice } = await inquirer.prompt([iTunesOrFilePath]);
    if(shareChoice === 'iTunes') {
      const { userName } = await inquirer.prompt([clientUsername]);
      return {
        savePath,
        userName
      };
    } else {
      const { customSharedPath } = await inquirer.prompt([customSharedFilePath]);
      return {
        savePath,
        customSharedPath
      };
    }
  }
};
