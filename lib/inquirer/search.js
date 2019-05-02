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


module.exports = async function searchQuestions(masterSongList) {
  const mappedSongList = masterSongList.map(song => {
    return { name: song.title, value: song._id };
  });
  // each obj { name: song title **by artist**, value: {_id}}

  const { searchOption } = await inquirer.prompt([searchType]);
  switch(searchOption) {
    case 'browseAll': {
      const browseAllFiles = {
        type: 'list',
        name: 'selectedFile',
        choices: [mappedSongList],
        pageSize: 10
      };
      const { selectedFile } = await inquirer.prompt([browseAllFiles]);
      return selectedFile;
    }
      
    default:
      break;
  }
};
