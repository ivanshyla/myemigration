const fs = require('fs');
const path = require('path');

// Create a simple 1200x630 PNG image using Canvas API
// This is a placeholder - you can replace this with actual image generation
// For now, we'll create a simple SVG and suggest converting it

const svgContent = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ffffff"/>
  <text x="600" y="300" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#000000">Белэміграцыя</text>
  <text x="600" y="380" font-family="Arial, sans-serif" font-size="30" text-anchor="middle" fill="#666666">Колькі дзён у эміграцыі?</text>
</svg>`;

const outputPath = path.join(__dirname, '../public/og.svg');
fs.writeFileSync(outputPath, svgContent);

console.log('Created og.svg at:', outputPath);
console.log('You can convert this SVG to PNG using online tools or image editors');
console.log('Recommended size: 1200x630 pixels');
