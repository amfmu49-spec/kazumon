const Jimp = require('jimp');

Jimp.read('src/assets/logo_transparent.png').then(image => {
  image.autocrop(); // Automatically crop transparent borders
  image.write('src/assets/logo_transparent.png');
  console.log('Autocrop completed.');
}).catch(err => {
  console.error(err);
});
