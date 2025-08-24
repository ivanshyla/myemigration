const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 600x315 canvas (Facebook minimum)
const width = 600;
const height = 315;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Fill with white background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, width, height);

// Set text properties
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Main title (smaller font for smaller canvas)
ctx.font = 'bold 36px Arial, sans-serif';
ctx.fillText('Белэміграцыя', width / 2, height / 2 - 20);

// Subtitle
ctx.font = '18px Arial, sans-serif';
ctx.fillStyle = '#666666';
ctx.fillText('Колькі дзён у эміграцыі?', width / 2, height / 2 + 20);

// Save as JPEG with lower quality for smaller file size
const outputPath = path.join(__dirname, '../public/og-simple.jpg');
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
fs.writeFileSync(outputPath, buffer);

console.log('Created og-simple.jpg at:', outputPath);
console.log('Size:', width, 'x', height, 'pixels');
console.log('Format: JPEG (Facebook minimum size)');
console.log('File size:', (buffer.length / 1024).toFixed(1), 'KB');
