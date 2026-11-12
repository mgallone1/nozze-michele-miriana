const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');
const marker = '"guests":';
const idx = content.indexOf(marker);
const jsonPart = content.slice(idx + marker.length).trim().replace(/;[\s\n]*$/, '');
const guests = JSON.parse(jsonPart.slice(0, jsonPart.lastIndexOf(']')+1));
console.log('Seed guests count in data.js:', guests.length);
console.log('Sample seed guests in data.js:', guests.slice(0, 5).map(g => g.name));
