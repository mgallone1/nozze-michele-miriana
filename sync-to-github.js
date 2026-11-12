const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const gh = 'C:\\Users\\Miriana\\AppData\\Local\\Microsoft\\WinGet\\Packages\\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\\bin\\gh.exe';
const repo = 'mgallone1/nozze-michele-miriana';

async function pushToGitHub() {
  console.log('--- LETTURA ALBERO GITHUB ---');
  const treeRaw = execSync(`"${gh}" api repos/${repo}/git/trees/main?recursive=1`, { encoding: 'utf8' });
  const treeData = JSON.parse(treeRaw);
  const shaMap = {};
  treeData.tree.forEach(item => {
    if (item.type === 'blob') {
      shaMap[item.path] = item.sha;
    }
  });

  const filesToUpdate = [
    'index.html',
    'css/style.css',
    'js/data.js',
    'js/domain/entities.js',
    'js/repositories/expense-repository.js',
    'js/services/formatters.js',
    'js/ui/views.js',
    'js/usecases/usecases.js',
    'js/main.js',
    'sw.js',
    'matrimonio-michele-miriana-standalone.html'
  ];

  for (const relPath of filesToUpdate) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath).toString('base64');
    const existingSha = shaMap[relPath];

    const payload = {
      message: `Sync automatico: ${relPath}`,
      content: content,
      branch: 'main'
    };
    if (existingSha) {
      payload.sha = existingSha;
    }

    const tmpFile = path.resolve('.tmp_sync_payload.json');
    fs.writeFileSync(tmpFile, JSON.stringify(payload));
    try {
      execSync(`"${gh}" api -X PUT repos/${repo}/contents/${relPath} --input "${tmpFile}"`, { stdio: 'pipe' });
      console.log(`✓ Pubblicato su GitHub: ${relPath}`);
    } catch (err) {
      console.error(`Errore caricamento ${relPath}:`, err.message);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }
  console.log('TUTTI I FILE PUBBLICATI CON SUCCESSO!');
}

pushToGitHub();
