const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = process.execPath;

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[36m%s\x1b[0m', '   FINX: Unified Full-Stack Dev Server Runner        ');
console.log('\x1b[36m%s\x1b[0m', '   Frontend + Backend connected as single host:       ');
console.log('\x1b[32m%s\x1b[0m', '   -> Localhost UI & API: http://localhost:3000       ');
console.log('\x1b[36m%s\x1b[0m', '=====================================================\n');

// 1. Start Backend Server (Express + AI Engine)
const backend = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, PORT: process.env.PORT || '5001' }
});

// 2. Start Frontend Server (Next.js Turbopack)
const frontend = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env }
});

function cleanup() {
    console.log('\nStopping FINX unified services...');
    try { backend.kill(); } catch (e) {}
    try { frontend.kill(); } catch (e) {}
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
backend.on('exit', (code) => {
    if (code !== 0 && code !== null) console.error(`Backend process exited with code ${code}`);
});
frontend.on('exit', (code) => {
    if (code !== 0 && code !== null) console.error(`Frontend process exited with code ${code}`);
});
