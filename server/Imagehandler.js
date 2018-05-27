const gifsicle = require('gifsicle');
const sharp = require('sharp');
const { promisify, promisifyAll } = require('bluebird');
const { execFile } = require('child_process');
const { readFile } = require('fs');
const { MAX_IMAGE_DIMENSION, MAX_GIF_DIMENSION } = require('./constants');

const execFileAsync = promisify(execFile);
const readFileAsync = promisify(readFile);
promisifyAll(sharp.prototype);

function getOutputFormat(type) {
  if (type === 'image/png') return 'png';
  return 'jpeg';
}

async function ImageHandler(file) {
  if (file.type === 'image/svg+xml') {
    return await readFileAsync(file.path);
  } else if (file.type === 'image/gif') {
    const outputFile = `${file.path}.tmp`;
    const outputSize = `${MAX_GIF_DIMENSION}x${MAX_GIF_DIMENSION}`;
    await execFileAsync(gifsicle, ['-o', outputFile, '--resize-fit', outputSize, file.path]);
    return await readFileAsync(outputFile);
  }

  return await sharp(file.path)
    .resize(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION)
    .setFormat(getOutputFormat(file.type))
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => { return data })
  .catch (err => { console.error(err) });
}

module.exports = transferImage;
