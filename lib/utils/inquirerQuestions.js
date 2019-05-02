const iTunesOrPath = {
  type: 'list',
  name: 'authType',
  message: 'Welcome to Sleepster, to get started we need to know what files you want to share. We can automatically share the contents of '
  choices: [
    { name: 'iTunes', value: '/auth/signup' },
    { name: 'filePath', value: '/auth/signin' }
  ]
};

const userEmail = {
  type: 'input',
  name: 'email'
};

const userPassword = {
  type: 'password',
  name: 'password'
};
