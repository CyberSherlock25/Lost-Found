const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
const maven = path.join(root, 'backend', '.tools', 'apache-maven-3.9.9', 'bin', process.platform === 'win32' ? 'mvn.cmd' : 'mvn');
let stopping = false;

function start(command, args, cwd, options = {}) {
  return spawn(command, args, { cwd, stdio: 'inherit', windowsHide: true, ...options });
}

const backend = start(maven, ['spring-boot:run'], path.join(root, 'backend'), { shell: process.platform === 'win32' });
const frontend = start(process.execPath, [npmCli, '--prefix', 'frontend', 'run', 'dev'], root);
const children = [backend, frontend];

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach((child) => { if (!child.killed) child.kill(); });
  setTimeout(() => process.exit(exitCode), 300);
}

children.forEach((child) => {
  child.on('error', (error) => {
    console.error(`Failed to start a development process: ${error.message}`);
    stopAll(1);
  });
  child.on('exit', (code) => {
    if (!stopping) {
      console.error(`A development process stopped${code ? ` with code ${code}` : ''}. Shutting down both apps.`);
      stopAll(code || 0);
    }
  });
});

process.on('SIGINT', () => stopAll());
process.on('SIGTERM', () => stopAll());

