const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 1200x630 canvas
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Fill with white background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, width, height);

// Set text properties
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Main title
ctx.font = 'bold 72px Arial, sans-serif';
ctx.fillText('Белэміграцыя', width / 2, height / 2 - 40);

// Subtitle
ctx.font = '30px Arial, sans-serif';
ctx.fillStyle = '#666666';
ctx.fillText('Колькі дзён у эміграцыі?', width / 2, height / 2 + 40);

// Save as JPEG
const outputPath = path.join(__dirname, '../public/og.jpg');
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
fs.writeFileSync(outputPath, buffer);

console.log('Created og.jpg at:', outputPath);
console.log('Size:', width, 'x', height, 'pixels');
console.log('Format: JPEG');
