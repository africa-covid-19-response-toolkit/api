module.exports.hello = async (event, context, callback) => {
  return JSON.stringify({ message: 'Hello World' });
};
