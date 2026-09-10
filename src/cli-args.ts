import path from 'node:path';
import type { ProjectAnswers } from './types.js';
import { resolveTargetDirectory } from './utils/validate.js';

export function parseArgs(argv: string[]): {
  defaults: boolean;
  name?: string;
  dir?: string;
  skipInstall: boolean;
  help: boolean;
} {
  const args = argv.slice(2);
  const result = {
    defaults: false,
    skipInstall: false,
    help: false,
    name: undefined as string | undefined,
    dir: undefined as string | undefined,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--defaults' || arg === '-y' || arg === '--yes') {
      result.defaults = true;
    } else if (arg === '--skip-install') {
      result.skipInstall = true;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--name' || arg === '-n') {
      result.name = args[i + 1];
      i += 1;
    } else if (arg === '--dir' || arg === '-d') {
      result.dir = args[i + 1];
      i += 1;
    } else if (!arg.startsWith('-') && !result.name) {
      result.name = arg;
    }
  }

  return result;
}

export function printHelp(): void {
  console.log(`
create-react-starter-kit

Usage:
  create-react-starter-kit [project-name] [options]

Options:
  -y, --yes, --defaults   Use recommended defaults (non-interactive)
  -n, --name <name>       Project name
  -d, --dir <path>        Target directory
  --skip-install          Do not install dependencies
  -h, --help              Show help
`);
}

export function buildDefaultAnswers(options: {
  name?: string;
  dir?: string;
  skipInstall?: boolean;
}): ProjectAnswers {
  const projectName = options.name?.trim() || 'my-react-app';
  const targetDir = resolveTargetDirectory(
    process.cwd(),
    projectName,
    options.dir ?? path.join('.', projectName),
  );

  return {
    projectName,
    targetDir,
    buildTool: 'vite',
    language: 'typescript',
    router: 'react-router',
    stateManagement: 'redux',
    serverState: 'rtk-query',
    forms: 'react-hook-form',
    validation: 'zod',
    styling: 'tailwind',
    uiLibrary: 'shadcn',
    unitTesting: 'vitest',
    e2eTesting: 'playwright',
    visualTesting: 'storybook',
    linting: 'eslint',
    formatting: 'prettier',
    apiLayer: 'axios',
    packageManager: 'pnpm',
    errorTracking: 'sentry',
    installDependencies: !options.skipInstall,
  };
}
