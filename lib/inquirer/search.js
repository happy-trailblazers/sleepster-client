const inquirer = require('inquirer');
const Fuse = require('fuse.js');

const searchType = {
  type: 'list',
  name: 'searchOption',
  message: 'How would you like to search?',
  choices: [
    { name: 'Browse All Files', value: 'browseAll' },
    { name: 'Search for File', value: 'searchForFile' },
    { name: 'Quit Sleepster', value: 'quit' }
  ]
}; 

module.exports = async function searchQuestions(messagePackage) {
  const parsedPackage = JSON.parse(messagePackage);
  let masterSongList = null;
  if(parsedPackage.notFound) {
    masterSongList = parsedPackage.masterSongList;
    console.log('Requested file no longer available');
  } else {
    masterSongList = parsedPackage;
  }
  const mappedSongList = masterSongList.map(song => {
    return { name: song.title, value: song._id };
  });

  const { searchOption } = await inquirer.prompt([searchType]);
  switch(searchOption) {
    case 'browseAll': {
      const browseAllFiles = {
        type: 'list',
        name: 'selectedFile',
        choices: [{ name: '\x1b[36m*** GO BACK TO SEARCH OPTIONS ***\x1b[39m', value: '&goBack&' }, ...mappedSongList],
        pageSize: 10
      };
      const { selectedFile } = await inquirer.prompt([browseAllFiles]);
      
      return selectedFile;
    }
    case 'searchForFile': {
      const fileSearch = {
        type: 'input',
        name: 'searchQuery',
        message: 'Search by Keyword (works for Song, Artist, or Album)'
      };
      const { searchQuery } = await inquirer.prompt([fileSearch]);

      const fuse = new Fuse(masterSongList, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'title',
          'artist',
          'album'
        ]
      });
      const results = fuse.search(searchQuery);
      const mappedSearchList = results.map(song => {
        return { name: `${song.title} Artist: ${song.artist} Album: ${song.album}`, value: song._id };
      });
      const browseFilter = {
        type: 'list',
        name: 'selectedFile',
        choices: [{ name: '\x1b[36m*** GO BACK TO SEARCH OPTIONS ***\x1b[39m', value: '&goBack&' }, ...mappedSearchList],
        pageSize: 10
      };
      const { selectedFile } = await inquirer.prompt([browseFilter]);
      return selectedFile;
    }
    case 'quit':
      return process.exit();
    default:
      break;
  }
};
