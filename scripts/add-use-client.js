const fs = require('fs');
const path = require('path');

const files = [
  'dist/index.js',
  'dist/index.mjs',
  'dist/dashboard/index.js',
  'dist/dashboard/index.mjs',
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('"use client"')) {
      fs.writeFileSync(filePath, '"use client";\n' + content);
    }
  }
}
