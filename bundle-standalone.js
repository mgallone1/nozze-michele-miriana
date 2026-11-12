const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\Miriana\\Documents\\Antigravity projects';

// 1. Legge index.html
let html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

// 2. Legge css/style.css
const css = fs.readFileSync(path.join(projectRoot, 'css/style.css'), 'utf8');

// 3. Legge tutti gli script in ordine rigoroso di Clean Architecture
const jsFiles = [
  'js/data.js',
  'js/domain/entities.js',
  'js/services/formatters.js',
  'js/repositories/expense-repository.js',
  'js/usecases/usecases.js',
  'js/ui/views.js',
  'js/main.js'
];

let combinedJs = '';
jsFiles.forEach(file => {
  const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
  combinedJs += `\n/* ===== FILE: ${file} ===== */\n` + content + '\n';
});

// Sostituisce il link css con tag <style>
html = html.replace('<link rel="stylesheet" href="css/style.css">', `<style>\n${css}\n</style>`);

// Rimuove i tag <script src="..."> separati e inietta lo script integrato prima di </body>
const scriptTagsRegex = /<!-- CLEAN ARCHITECTURE LAYERS -->[\s\S]*?<\/body>/;
const inlineScriptsBlock = `<!-- CLEAN ARCHITECTURE ALL-IN-ONE BUNDLE -->\n  <script>\n${combinedJs}\n  </script>\n</body>`;

html = html.replace(scriptTagsRegex, inlineScriptsBlock);

// Salva il file standalone universale
const bundlePath = path.join(projectRoot, 'matrimonio-michele-miriana-standalone.html');
fs.writeFileSync(bundlePath, html, 'utf8');

console.log('✓ File standalone creato con successo:', bundlePath);
console.log('  Dimensione:', Math.round(html.length / 1024), 'KB');
