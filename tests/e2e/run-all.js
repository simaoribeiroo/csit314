const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DIR = __dirname;

function listTestFiles() {
  return fs.readdirSync(DIR)
    .filter(f => f.endsWith('.js'))
    .filter(f => f !== path.basename(__filename));
}

function runFile(file) {
  const p = spawnSync(process.execPath, [path.join(DIR, file)], { stdio: 'inherit' });
  return p.status || 0;
}

function run() {
  const files = listTestFiles();
  if (files.length === 0) {
    console.log('No .js test files found in', DIR);
    return 0;
  }

  let exitCode = 0;
  for (const file of files) {
    console.log('Running', file);
    const code = runFile(file);
    if (code !== 0) {
      console.error(file, 'failed with exit code', code);
      exitCode = code;
      break;
    }
  }

  if (exitCode !== 0) process.exit(exitCode);
  return exitCode;
}

module.exports = { run };

if (require.main === module) {
  run();
}
