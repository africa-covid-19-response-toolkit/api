module.exports.hello = async (event, context, callback) => {
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ message: 'Hello World' }),
  };
};
