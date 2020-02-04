const { Api } = require('./api')

console.log('Api', Api);

const initConv = async (input) => {
  const apia = new Api();
  return apia.getConv(input)
};

(async () => {
  return initConv("hello");
})();
