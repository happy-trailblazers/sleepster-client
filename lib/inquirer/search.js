const inquirer = require('inquirer');

const searchType = {
  type: 'list',
  name: 'searchOption',
  message: 'How would you like to search?',
  choices: [
    { name: 'Browse All Files', value: 'browseAll' },
    { name: 'Search by Song Title', value: 'searchTitle' },
    { name: 'Search by Artist', value: 'searchArtist' },
    { name: 'Search by Album', value: 'searchAlbum' }
  ]
}; 


module.exports = async function searchQuestions(package) {
  let masterSongList = null;
  if(package.notFound) {
    masterSongList = package.masterSongList;
    console.log('Requested file no longer available');
  } else {
    masterSongList = package;
  }
  const mappedSongList = JSON.parse(masterSongList).map(song => {
    return { name: song.title, value: song._id };
  });
  console.log('**', mappedSongList);
  const { searchOption } = await inquirer.prompt([searchType]);
  switch(searchOption) {
    case 'browseAll': {
      const browseAllFiles = {
        type: 'list',
        name: 'selectedFile',
        choices: [...mappedSongList],
        pageSize: 10
      };
      const { selectedFile } = await inquirer.prompt([browseAllFiles]);
      return selectedFile;
    }
      
    default:
      break;
  }
};
