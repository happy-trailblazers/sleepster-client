const messageDecoder = () => { 
  let body = null;
  return (stringChunk) => {
    // console.log(stringChunk);
    if(stringChunk.startsWith('!') && stringChunk.endsWith('%')) {
      return stringChunk;
    } else if(stringChunk.startsWith('!')) {
    // we have beginning chunk
      body = stringChunk;
    } else if(stringChunk.endsWith('%')) {
      const fullBody = body + stringChunk;
      body = null;
      return fullBody;
    } else {
    // we have a middle chunk
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
