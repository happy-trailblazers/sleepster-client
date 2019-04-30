const { messageDecoder } = require('../../lib/utils/messageDecoder');

describe('message decoder tests', () => {
  it('concats chunks into one body', () => {
    const chunk1 = '!01!chunk1';
    const chunk2 = 'chunk2';
    const chunk3 = 'chunk3%01%';
    const decoder = messageDecoder();
    decoder(chunk1);
    decoder(chunk2);
    const result = decoder(chunk3);
    expect(result).toEqual(chunk1 + chunk2 + chunk3);
  });
});
