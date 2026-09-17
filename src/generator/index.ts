import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import ejs from 'ejs';
import { execa } from 'execa';
import type { ProjectAnswers, TemplateContext } from '../types.js';
import { resolveDependencies, buildScripts } from './dependencies.js';
import { createSpinner, logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveBiomeCli(): string {
  const candidates = [
    path.resolve(__dirname, '../../node_modules/@biomejs/biome/bin/biome'),
    path.resolve(__dirname, '../node_modules/@biomejs/biome/bin/biome'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return 'biome';
}

async function fixImportsWithEslint(
  targetDir: string,
  packageManager: ProjectAnswers['packageManager'],
): Promise<void> {
  const fixSpinner = createSpinner('Applying ESLint import order...');
  fixSpinner.start();
  try {
    if (packageManager === 'pnpm') {
      await execa('pnpm', ['exec', 'eslint', 'src', 'tests', '--fix'], {
        cwd: targetDir,
        stdio: 'pipe',
      });
    } else if (packageManager === 'yarn') {
      await execa('yarn', ['eslint', 'src', 'tests', '--fix'], {
        cwd: targetDir,
        stdio: 'pipe',
      });
    } else {
      await execa('npx', ['eslint', 'src', 'tests', '--fix'], {
        cwd: targetDir,
        stdio: 'pipe',
      });
    }
    fixSpinner.succeed('ESLint import order applied');
  } catch {
    fixSpinner.warn('ESLint fix skipped — run `pnpm lint:fix` after install.');
  }
}

function e2eInstallCommand(packageManager: ProjectAnswers['packageManager']): string {
  return packageManager === 'npm'
    ? 'npm run test:e2e:install'
    : `${packageManager} test:e2e:install`;
}

async function installCypressBinary(
  targetDir: string,
  packageManager: ProjectAnswers['packageManager'],
): Promise<void> {
  const cypressReady = await fs.pathExists(
    path.join(targetDir, 'node_modules/cypress/package.json'),
  );
  if (!cypressReady) {
    return;
  }

  const spinner = createSpinner('Installing Cypress binary...');
  spinner.start();
  try {
    if (packageManager === 'pnpm') {
      await execa('pnpm', ['exec', 'cypress', 'install'], {
        cwd: targetDir,
        stdio: 'pipe',
      });
    } else if (packageManager === 'yarn') {
      await execa('yarn', ['cypress', 'install'], {
        cwd: targetDir,
        stdio: 'pipe',
      });
    } else {
      await execa('npx', ['cypress', 'install'], {
        cwd: targetDir,
        stdio: 'pipe',
      });
    }
    spinner.succeed('Cypress binary installed');
  } catch {
    spinner.warn(
      `Cypress binary skipped — run \`${e2eInstallCommand(packageManager)}\` after install.`,
    );
  }
}

async function formatGeneratedProjectWithBiome(targetDir: string): Promise<void> {
  const formatSpinner = createSpinner('Applying Biome formatting...');
  formatSpinner.start();
  try {
    await execa(resolveBiomeCli(), ['check', '--write', '.'], {
      cwd: targetDir,
      stdio: 'pipe',
    });
    formatSpinner.succeed('Biome formatting applied');
  } catch {
    formatSpinner.warn('Biome format skipped — run `pnpm lint:fix` after install.');
  }
}

function getTemplatesRoot(): string {
  // dist/generator -> ../../templates or ../templates depending on layout
  const candidates = [
    path.resolve(__dirname, '../../templates'),
    path.resolve(__dirname, '../templates'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

function createContext(answers: ProjectAnswers): TemplateContext {
  return {
    ...answers,
    language: 'typescript',
    isTypeScript: true,
    ext: 'ts',
    jsxExt: 'tsx',
    year: new Date().getFullYear(),
  };
}

function labelMap(): Record<string, Record<string, string>> {
  return {
    buildTool: {
      vite: 'Vite',
      webpack: 'Webpack',
      rsbuild: 'Rsbuild',
    },
    language: {
      typescript: 'TypeScript',
    },
    router: {
      'react-router': 'React Router',
      'tanstack-router': 'TanStack Router',
    },
    stateManagement: {
      redux: 'Redux Toolkit',
      zustand: 'Zustand',
      jotai: 'Jotai',
      context: 'Context API + useReducer',
      none: 'None',
    },
    serverState: {
      'tanstack-query': 'TanStack Query',
      swr: 'SWR',
      'rtk-query': 'RTK Query',
      none: 'None',
    },
    forms: {
      'react-hook-form': 'React Hook Form',
      formik: 'Formik',
      'tanstack-form': 'TanStack Form',
      none: 'None',
    },
    validation: {
      zod: 'Zod',
      yup: 'Yup',
      valibot: 'Valibot',
      joi: 'Joi',
      none: 'None',
    },
    styling: {
      tailwind: 'Tailwind CSS',
      'css-modules': 'CSS Modules',
      'styled-components': 'Styled Components',
      sass: 'Sass/SCSS',
    },
    uiLibrary: {
      mui: 'MUI',
      antd: 'Ant Design',
      chakra: 'Chakra UI',
      shadcn: 'shadcn/ui',
      'headless-ui': 'Headless UI',
      none: 'None',
    },
    unitTesting: {
      vitest: 'Vitest + React Testing Library',
      jest: 'Jest + React Testing Library',
      none: 'None',
    },
    e2eTesting: {
      playwright: 'Playwright',
      cypress: 'Cypress',
      none: 'None',
    },
    visualTesting: {
      storybook: 'Storybook',
      none: 'None',
    },
    linting: {
      eslint: 'ESLint + Prettier',
      biome: 'Biome',
    },
    formatting: {
      prettier: 'Prettier',
      none: 'Biome (built-in)',
    },
    apiLayer: {
      axios: 'REST via Axios',
      fetch: 'REST via Fetch',
      none: 'RTK Query (fetchBaseQuery)',
    },
    packageManager: {
      pnpm: 'pnpm',
      yarn: 'yarn',
      npm: 'npm',
    },
    errorTracking: {
      sentry: 'Sentry',
      bugsnag: 'Bugsnag',
      logrocket: 'LogRocket',
      datadog: 'Datadog RUM',
      none: 'None',
    },
  };
}

export function getStackLabels(answers: ProjectAnswers): Record<string, string> {
  const map = labelMap();
  return {
    buildTool: map.buildTool[answers.buildTool],
    language: map.language[answers.language],
    router: map.router[answers.router],
    stateManagement: map.stateManagement[answers.stateManagement],
    serverState: map.serverState[answers.serverState],
    forms: map.forms[answers.forms],
    validation: map.validation[answers.validation],
    styling: map.styling[answers.styling],
    uiLibrary: map.uiLibrary[answers.uiLibrary],
    unitTesting: map.unitTesting[answers.unitTesting],
    e2eTesting: map.e2eTesting[answers.e2eTesting],
    visualTesting: map.visualTesting[answers.visualTesting],
    linting: map.linting[answers.linting],
    formatting: map.formatting[answers.formatting],
    apiLayer: map.apiLayer[answers.apiLayer],
    packageManager: map.packageManager[answers.packageManager],
    errorTracking: map.errorTracking[answers.errorTracking],
    gitHooks: 'Husky + lint-staged + commitlint',
    folderPattern: 'Feature-based (domain-driven)',
  };
}

async function renderTemplate(
  templatePath: string,
  context: TemplateContext & { stackLabels: Record<string, string> },
): Promise<string> {
  const content = await fs.readFile(templatePath, 'utf8');
  return ejs.render(content, context, { async: false });
}

async function walkTemplates(
  dir: string,
  baseDir: string,
): Promise<{ absolute: string; relative: string }[]> {
  const results: { absolute: string; relative: string }[] = [];
  if (!(await fs.pathExists(dir))) {
    return results;
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkTemplates(absolute, baseDir)));
    } else {
      results.push({
        absolute,
        relative: path.relative(baseDir, absolute),
      });
    }
  }
  return results;
}

function shouldIncludeTemplate(
  relativePath: string,
  answers: ProjectAnswers,
): boolean {
  const normalized = relativePath.replace(/\\/g, '/');

  // Conditional template folders by convention: __when_<key>_<value>__
  const whenMatch = normalized.match(/__when_([a-zA-Z0-9]+)_([a-zA-Z0-9-]+)__/);
  if (whenMatch) {
    const [, key, value] = whenMatch;
    const answerValue = answers[key as keyof ProjectAnswers];
    // Shared unit tests ship for both Vitest and Jest.
    if (key === 'unitTesting' && value === 'shared') {
      return answers.unitTesting === 'vitest' || answers.unitTesting === 'jest';
    }
    // shadcn/ui depends on Tailwind utilities even if another styling option was picked
    if (
      key === 'styling' &&
      value === 'tailwind' &&
      answers.uiLibrary === 'shadcn' &&
      answerValue !== 'tailwind'
    ) {
      return true;
    }
    if (answerValue !== value) {
      return false;
    }
  }

  // Language-specific templates (TypeScript only)
  if (normalized.includes('__js__/')) {
    return false;
  }

  return true;
}

function resolveOutputPath(
  relativePath: string,
  answers: ProjectAnswers,
): string {
  let out = relativePath.replace(/\\/g, '/');

  // Strip conditional markers from path
  out = out.replace(/__when_[a-zA-Z0-9]+_[a-zA-Z0-9-]+__\//g, '');
  out = out.replace(/__ts__\//g, '');
  out = out.replace(/__js__\//g, '');

  // Extension placeholders
  out = out.replace(/\.tsx\.ejs$/, '.tsx');
  out = out.replace(/\.ts\.ejs$/, '.ts');
  out = out.replace(/\.jsx\.ejs$/, '.jsx');
  out = out.replace(/\.js\.ejs$/, '.js');
  out = out.replace(/\.ejs$/, '');

  // Rename config files based on selections
  if (out === 'vite.config.ts' && answers.buildTool !== 'vite') {
    return '';
  }

  // Vitest lives in vite.config for Vite; emit standalone config otherwise
  if (out === 'vitest.config.ts' && answers.buildTool === 'vite') {
    return '';
  }

  if (out === 'rsbuild.config.ts' && answers.buildTool !== 'rsbuild') {
    return '';
  }

  if (
    out === 'src/styles/global.css' &&
    answers.styling === 'sass' &&
    answers.uiLibrary !== 'shadcn'
  ) {
    out = 'src/styles/global.scss';
  }

  return out;
}

export async function generateProject(answers: ProjectAnswers): Promise<void> {
  const spinner = createSpinner('Preparing project...');
  spinner.start();

  const context = createContext(answers);
  const stackLabels = getStackLabels(answers);
  const fullContext = { ...context, stackLabels };

  await fs.emptyDir(answers.targetDir);

  const templatesRoot = getTemplatesRoot();
  const files = await walkTemplates(templatesRoot, templatesRoot);

  spinner.text = 'Rendering templates...';

  for (const file of files) {
    if (!shouldIncludeTemplate(file.relative, answers)) {
      continue;
    }

    const outputRelative = resolveOutputPath(file.relative, answers);
    if (!outputRelative) {
      continue;
    }

    // Skip build-tool specific configs that don't match
    if (
      outputRelative.startsWith('configs/') ||
      file.relative.includes(`__when_buildTool_`) === false
    ) {
      // handled by when markers
    }

    const isEjs = file.relative.endsWith('.ejs');
    const dest = path.join(answers.targetDir, outputRelative);

    await fs.ensureDir(path.dirname(dest));

    if (isEjs) {
      const rendered = await renderTemplate(file.absolute, fullContext);
      await fs.writeFile(dest, rendered, 'utf8');
    } else {
      await fs.copy(file.absolute, dest);
    }
  }

  // Generate package.json programmatically
  spinner.text = 'Writing package.json...';
  const { dependencies, devDependencies } = resolveDependencies(answers);
  const scripts = buildScripts(answers);

  const pkg: Record<string, unknown> = {
    name: answers.projectName,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts,
    dependencies,
    devDependencies,
  };

  if (answers.packageManager === 'pnpm') {
    const onlyBuiltDependencies = ['esbuild'];
    if (answers.e2eTesting === 'cypress') {
      onlyBuiltDependencies.push('cypress');
    }
    pkg.pnpm = { onlyBuiltDependencies };
  }

  pkg['lint-staged'] =
    answers.linting === 'biome'
      ? {
          '*.{js,jsx,ts,tsx,cjs,mjs}': [
            'biome check --write --files-ignore-unknown=true --no-errors-on-unmatched',
          ],
          '*.{css,scss,md,json}': [
            'biome check --write --files-ignore-unknown=true --no-errors-on-unmatched',
          ],
        }
      : {
          '*.{js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix', 'prettier --write'],
          '*.{css,scss,md,json}': ['prettier --write'],
        };

  await fs.writeJson(path.join(answers.targetDir, 'package.json'), pkg, {
    spaces: 2,
  });

  // Scalable feature-based layout used across large production React apps
  const dirs = [
    'src/assets',
    'src/components/layout',
    'src/components/ui',
    'src/config',
    'src/features',
    'src/hooks',
    'src/lib',
    'src/routes',
    'src/services',
    'src/store',
    'src/styles',
    'src/types',
    'src/utils',
    'docs/examples',
    'tests',
    'public',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(answers.targetDir, dir));
  }

  for (const hook of ['.husky/pre-commit', '.husky/commit-msg', '.husky/pre-push']) {
    const hookPath = path.join(answers.targetDir, hook);
    if (await fs.pathExists(hookPath)) {
      await fs.chmod(hookPath, 0o755);
    }
  }

  spinner.succeed('Project files generated');

  if (answers.linting === 'biome') {
    await formatGeneratedProjectWithBiome(answers.targetDir);
  }

  // Husky's `prepare` script only installs hooks when `.git` already exists.
  // git init MUST run before the package-manager install.
  if (answers.installDependencies) {
    const gitSpinner = createSpinner('Initializing git repository...');
    gitSpinner.start();
    try {
      await execa('git', ['init'], { cwd: answers.targetDir, stdio: 'pipe' });
      gitSpinner.succeed('Git repository initialized');
    } catch {
      gitSpinner.warn('git init skipped — run git init, then install, so Husky can attach hooks.');
    }

    const installSpinner = createSpinner(
      `Installing dependencies with ${answers.packageManager}...`,
    );
    installSpinner.start();
    try {
      const command =
        answers.packageManager === 'npm'
          ? 'npm'
          : answers.packageManager === 'yarn'
            ? 'yarn'
            : 'pnpm';
      const args = ['install'];
      await execa(command, args, {
        cwd: answers.targetDir,
        stdio: 'pipe',
      });
      installSpinner.succeed('Dependencies installed (Husky hooks via prepare)');
    } catch {
      installSpinner.warn(
        `Could not install with ${answers.packageManager}. Run install after git init so Husky can set up hooks.`,
      );
    }

    const eslintReady = await fs.pathExists(
      path.join(answers.targetDir, 'node_modules/eslint/package.json'),
    );
    if (answers.linting === 'eslint' && eslintReady) {
      await fixImportsWithEslint(answers.targetDir, answers.packageManager);
    }

    if (answers.e2eTesting === 'cypress') {
      await installCypressBinary(answers.targetDir, answers.packageManager);
    }
  }
}

export function printSuccess(answers: ProjectAnswers): void {
  const relative = path.relative(process.cwd(), answers.targetDir) || '.';
  const pm = answers.packageManager;
  const devCmd =
    pm === 'npm' ? 'npm run dev' : pm === 'yarn' ? 'yarn dev' : 'pnpm dev';
  const installCmd =
    pm === 'npm' ? 'npm install' : pm === 'yarn' ? 'yarn install' : 'pnpm install';

  logger.blank();
  logger.success(`Created ${answers.projectName} at ${relative}`);
  logger.blank();
  logger.info('Next steps:');
  console.log(`  cd ${relative}`);
  if (!answers.installDependencies) {
    console.log('  git init');
    console.log(`  ${installCmd}   # required after git init so Husky can install hooks`);
  }
  console.log(`  ${devCmd}`);
  if (answers.e2eTesting === 'playwright' || answers.e2eTesting === 'cypress') {
    console.log(`  ${e2eInstallCommand(pm)}   # once, before e2e`);
  }
  logger.blank();
  logger.dim('Documentation: docs/getting-started.md');
  logger.blank();
}
