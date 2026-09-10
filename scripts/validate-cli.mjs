import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'tmp-generated', 'validation-app');

fs.rmSync(path.dirname(outDir), { recursive: true, force: true });
fs.mkdirSync(path.dirname(outDir), { recursive: true });

console.log('Running CLI with --defaults --skip-install…');

const result = spawnSync(
  process.execPath,
  [
    path.join(root, 'bin', 'create-react-starter-kit.js'),
    '--defaults',
    '--name',
    'validation-app',
    '--dir',
    outDir,
    '--skip-install',
  ],
  { cwd: root, encoding: 'utf8', stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('CLI validation failed');
  process.exit(result.status ?? 1);
}

const required = [
  'package.json',
  'README.md',
  'index.html',
  'vite.config.ts',
  'src/main.tsx',
  'src/app/App.tsx',
  'src/routes/HomePage.tsx',
  'docs/getting-started.md',
  'docs/architecture.md',
  'docs/best-practices.md',
  'docs/selected-stack.md',
];

const missing = required.filter((rel) => !fs.existsSync(path.join(outDir, rel)));
if (missing.length) {
  console.error('Missing generated files:', missing.join(', '));
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(outDir, 'package.json'), 'utf8'));
if (pkg.name !== 'validation-app') {
  console.error('package.json name mismatch');
  process.exit(1);
}

if (!pkg.dependencies?.react || !pkg.devDependencies?.vite) {
  console.error('Expected React + Vite dependencies missing');
  process.exit(1);
}

console.log('\n✔ Validation passed');
console.log(`Generated project at: ${outDir}`);
console.log('Inspect it, then optionally: cd tmp-generated/validation-app && pnpm install && pnpm dev');
