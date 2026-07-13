const Jimp = require('jimp');

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const threshold = 200;

if (!inputPath || !outputPath) {
  console.error("Usage: node remove_bg.cjs <input> <output>");
  process.exit(1);
}

Jimp.read(inputPath).then(image => {
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  // Create a 2D array for visited
  const visited = new Set();
  const queue = [];
  
  const toKey = (x, y) => `${x},${y}`;
  
  // Enqueue corners
  const corners = [[0, 0], [width-1, 0], [0, height-1], [width-1, height-1]];
  for (const [x, y] of corners) {
    queue.push([x, y]);
    visited.add(toKey(x, y));
  }
  
  let qIdx = 0;
  while (qIdx < queue.length) {
    const [x, y] = queue[qIdx++];
    
    // Get pixel color
    const idx = (y * width + x) << 2;
    const r = image.bitmap.data[idx + 0];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    const a = image.bitmap.data[idx + 3];
    
    // If white-ish background
    if (r > threshold && g > threshold && b > threshold && a > 0) {
      // Make it transparent
      image.bitmap.data[idx + 3] = 0;
      
      // Neighbors
      const neighbors = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dx, dy] of neighbors) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const key = toKey(nx, ny);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push([nx, ny]);
          }
        }
      }
    }
  }
  
  image.write(outputPath, () => {
    console.log('Background removed successfully for', outputPath);
  });
}).catch(err => {
  console.error(err);
});
