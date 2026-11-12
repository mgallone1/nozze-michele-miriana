const { execSync } = require('child_process');
const gh = 'C:\\Users\\Miriana\\AppData\\Local\\Microsoft\\WinGet\\Packages\\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\\bin\\gh.exe';
const res = execSync(`"${gh}" api repos/mgallone1/nozze-michele-miriana/git/trees/main?recursive=1`, { encoding: 'utf8' });
const tree = JSON.parse(res).tree;
tree.forEach(f => console.log(f.path));
