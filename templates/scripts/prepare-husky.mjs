import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/**
 * Install Husky git hooks when `.git` exists.
 * Safe for ESM projects (`package.json` "type": "module") and for
 * `pnpm install` before the user has run `git init`.
 */
if (!existsSync(path.join(process.cwd(), '.git'))) {
  process.exit(0);
}

const binName = process.platform === 'win32' ? 'husky.cmd' : 'husky';
const huskyBin = path.join(process.cwd(), 'node_modules', '.bin', binName);

if (!existsSync(huskyBin)) {
  process.exit(0);
}

const result = spawnSync(huskyBin, [], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: process.platform === 'win32',
  env: process.env,
});

process.exit(result.status ?? 0);
