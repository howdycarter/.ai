const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'src'), { recursive: true });

for (const file of ['index.html', 'styles.css']) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}
for (const file of ['app.js', 'invoice.js']) {
  fs.copyFileSync(path.join(root, 'src', file), path.join(dist, 'src', file));
}

console.log(`Built baseline app at ${dist}`);
