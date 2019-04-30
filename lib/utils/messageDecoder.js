const messageDecoder = () => { 
  let body = null;
  return (stringChunk) => {
    if(stringChunk.startsWith('!') && stringChunk.endsWith('%')) {
      return stringChunk;
    } else if(stringChunk.startsWith('!')) {
      body = stringChunk;
    } else if(stringChunk.endsWith('%')) {
      const fullBody = body + stringChunk;
      body = null;
      return fullBody;
    } else {
      body += stringChunk;
    }
  };
};

const messageExtractor = (result) => {
  const messageCode = result.slice(1, 3);
  const message = result.substring(4, result.length - 4);

  return { messageCode, message };
};

module.exports = { messageDecoder, messageExtractor };
