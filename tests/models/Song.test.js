const mongoose = require('mongoose');
const Song = require('../../lib/models/Song');

describe('Song model', () => {
  const uid = new mongoose.Types.ObjectId;
  it('has Title, Artist, Album and User fields', () => {
    const song = new Song({
      title: 'Wish You Were Here',
      artist: 'Pink Floyd',
      album: 'Wish You Were Here',
      user: uid
    });


    expect(song.toJSON()).toEqual({
      title: 'Wish You Were Here',
      artist: 'Pink Floyd',
      album: 'Wish You Were Here',
      user: uid,
      _id: expect.any(mongoose.Types.ObjectId)
    });
  });
  it('requires title and user fields', () => {
    const song = new Song({});

    const errors = song.validateSync().errors;
    expect(errors.title.message).toBe('Path `title` is required.');
    expect(errors.user.message).toBe('Path `user` is required.');
  });
  it('has default album and artist', () => {
    const song = new Song({
      title: 'Wish You Were Here',
      user: uid
    });
    expect(song.toJSON()).toEqual({
      title: 'Wish You Were Here',
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      user: uid,
      _id: expect.any(mongoose.Types.ObjectId)
    });
  });
});

