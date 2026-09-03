const fs = require('fs');
const { execSync } = require('child_process');
const files = execSync('git grep -l "\\$[0-9]" frontend/src/').toString().trim().split('\n');
files.forEach(f => {
    f = f.trim();
    if (!f || f.includes('favicon.ico')) return;
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/\$([0-9.,]+[KMB]?)/g, '₹$1');
    fs.writeFileSync(f, content);
});
