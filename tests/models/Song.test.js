const mongoose = require('mongoose');
const Song = require('../../lib/models/Song');

describe('Song model', () => {
  it('has Title, Artist, Album, Path, and url fields', () => {
    const song = new Song({
      title: 'Wish You Were Here',
      artist: 'Pink Floyd',
      album: 'Wish You Were Here',
      url: 'gronk url',
      songPath: 'testpath'
    });


    expect(song.toJSON()).toEqual({
      title: 'Wish You Were Here',
      artist: 'Pink Floyd',
      album: 'Wish You Were Here',
      url: 'gronk url',
      songPath: 'testpath',
      _id: expect.any(mongoose.Types.ObjectId)
    });
  });
  it('requires title and url fields', () => {
    const song = new Song({});

    const errors = song.validateSync().errors;
    expect(errors.title.message).toBe('Path `title` is required.');
    expect(errors.url.message).toBe('Path `url` is required.');
  });
  it('has default album and artist', () => {
    const song = new Song({
      title: 'Wish You Were Here',
      url: 'gronk url'
    });
    expect(song.toJSON()).toEqual({
      title: 'Wish You Were Here',
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      url: 'gronk url',
      _id: expect.any(mongoose.Types.ObjectId)
    });
  });
});

