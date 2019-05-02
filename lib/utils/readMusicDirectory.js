const fs = require('fs').promises;


async function readMusicDirectory(user) {
  const filePath = `/Users/${user}/Music/iTunes/iTunes Media/Music`;
  const rawArtistList = await fs.readdir(filePath);
  const artistList = rawArtistList.filter(artist => artist[0] !== '.');
  const localSongList = [];

  for(let i = 0; i < artistList.length; i++) {

    const rawAlbumlist = await fs.readdir(`${filePath}/${artistList[i]}`);
    const albumList = rawAlbumlist.filter(album => album[0] !== '.');

    for(let j = 0; j < albumList.length; j++) {

      const rawSongsList = await fs.readdir(`${filePath}/${artistList[i]}/${albumList[j]}`);
      const songsList = rawSongsList.filter(song => song[0] !== '.');

      for(let k = 0; k < songsList.length; k++) {

        const songPath = `${filePath}/${artistList[i]}/${albumList[j]}/${songsList[k]}`;
        const song = {
          songPath,
          artist: artistList[i],
          album: albumList[j],
          title: songsList[k]
        };

        localSongList[localSongList.length] = song;
      } 
    }
  }
  return localSongList;
} 


module.exports = readMusicDirectory;
