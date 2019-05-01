const mongoose = require('mongoose');
const User = require('../../lib/models/User');

describe('User model', () => {
  it('has ip and url fields', () => {
    const user = new User({
      ip: '127.00.04',
      url: 'test.com'
    });

    expect(user.toJSON()).toEqual({
      ip: '127.00.04',
      url: 'test.com',
      _id: expect.any(mongoose.Types.ObjectId)
    });
  });
  it('requires ip and url fields', () => {
    const user = new User({});

    const errors = user.validateSync().errors;
    expect(errors.ip.message).toBe('Path `ip` is required.');
    expect(errors.url.message).toBe('Path `url` is required.');
  });
});
