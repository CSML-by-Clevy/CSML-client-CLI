const fs = require('fs');
const URL = require('url');
const path = require('path');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const asciify = require('asciify-image');

async function downloadFile(url) {
  const pathparts = URL.parse(url).pathname.split('/');
  const filename = pathparts[pathparts.length - 1];
  const target = path.join('/tmp/', uuidv4() + '-' + filename);

  const writer = fs.createWriteStream(target)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(target));
    writer.on('error', () => resolve(null));
  });

}

async function displayImage(filePath) {
  const localPath = filePath.startsWith('http')
    ? await downloadFile(filePath)
    : filePath;

  const options = {
    fit:    'box',
    width:  40,
    height: 40
  }

  try {
    const resp = await asciify(localPath, options);
    console.log(resp);
  }
  catch (err) {
    console.log(err);
    console.log(`🤖  [Image ${filePath}]`);
  }
}

module.exports = {
  downloadFile,
  displayImage,
}
