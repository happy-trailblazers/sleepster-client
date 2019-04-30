const { messageDecoder } = require('../../lib/utils/messageDecoder');

describe('message decoder tests', () => {
  let body = null;
  it('concats chunks into one body', () => {
    const chunk1 = '!01!chunk1';
    const chunk2 = 'chunk2';
    const chunk3 = 'chunk3%01%';
    let fullData = null;
    const decoder = messageDecoder();
    decoder(chunk1);
    decoder(chunk2);
    const result = decoder(chunk3);
    console.log(body, 'body', fullData, 'fullData');
    expect(result).toEqual(chunk1 + chunk2 + chunk3);
  });
});
