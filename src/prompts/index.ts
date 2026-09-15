import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'fs-extra';
import type { ProjectAnswers } from '../types.js';
import { resolveTargetDirectory, validateProjectName } from '../utils/validate.js';
import { logger } from '../utils/logger.js';

export async function collectAnswers(): Promise<ProjectAnswers> {
  logger.title('🚀  create-react-starter-kit');
  logger.dim('Answer each question. Press Enter to accept the default.\n');

  const { projectName } = await inquirer.prompt<{ projectName: string }>([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-react-app',
      validate: validateProjectName,
    },
  ]);

  const { targetPath } = await inquirer.prompt<{ targetPath: string }>([
    {
      type: 'input',
      name: 'targetPath',
      message: 'Where should we create the project?',
      default: `./${projectName}`,
    },
  ]);

  const targetDir = resolveTargetDirectory(process.cwd(), projectName, targetPath);

  if (await fs.pathExists(targetDir)) {
    const entries = await fs.readdir(targetDir);
    if (entries.length > 0) {
      const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${path.relative(process.cwd(), targetDir) || '.'} is not empty. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        throw new Error('Aborted: target directory already exists and was not overwritten.');
      }
    }
  }

  const stack = await inquirer.prompt<
    Omit<
      ProjectAnswers,
      'projectName' | 'targetDir' | 'installDependencies' | 'formatting' | 'apiLayer' | 'serverState'
    > & { apiLayer?: ProjectAnswers['apiLayer']; serverState?: ProjectAnswers['serverState'] }
  >([
    {
      type: 'list',
      name: 'buildTool',
      message: 'What build tool do you want to use?',
      choices: [
        { name: 'Vite', value: 'vite' },
        { name: 'Webpack', value: 'webpack' },
        { name: 'Rsbuild', value: 'rsbuild' },
      ],
      default: 'vite',
    },
    {
      type: 'list',
      name: 'language',
      message: 'What language do you want to choose?',
      choices: [
        { name: 'JavaScript', value: 'javascript' },
        { name: 'TypeScript', value: 'typescript' },
      ],
      default: 'typescript',
    },
    {
      type: 'list',
      name: 'router',
      message: 'What routing library do you want to use?',
      choices: [
        { name: 'React Router (react-router-dom)', value: 'react-router' },
        { name: 'TanStack Router', value: 'tanstack-router' },
      ],
      default: 'react-router',
    },
    {
      type: 'list',
      name: 'stateManagement',
      message: 'What state management library do you want to use?',
      choices: [
        { name: 'Redux Toolkit (RTK)', value: 'redux' },
        { name: 'Zustand', value: 'zustand' },
        { name: 'Jotai', value: 'jotai' },
        { name: 'Context API + useReducer', value: 'context' },
        { name: 'None', value: 'none' },
      ],
      default: 'redux',
    },
    {
      type: 'list',
      name: 'serverState',
      message: 'Server State / Data Fetching?',
      when: (answers: { stateManagement?: string }) => answers.stateManagement !== 'redux',
      choices: [
        { name: 'TanStack Query', value: 'tanstack-query' },
        { name: 'SWR', value: 'swr' },
        { name: 'None', value: 'none' },
      ],
      default: 'tanstack-query',
    },
    {
      type: 'list',
      name: 'forms',
      message: 'Forms?',
      choices: [
        { name: 'React Hook Form', value: 'react-hook-form' },
        { name: 'Formik', value: 'formik' },
        { name: 'TanStack Form', value: 'tanstack-form' },
        { name: 'None', value: 'none' },
      ],
      default: 'react-hook-form',
    },
    {
      type: 'list',
      name: 'validation',
      message: 'Schema Validation?',
      choices: [
        { name: 'Zod', value: 'zod' },
        { name: 'Yup', value: 'yup' },
        { name: 'Valibot', value: 'valibot' },
        { name: 'Joi', value: 'joi' },
        { name: 'None', value: 'none' },
      ],
      default: 'zod',
    },
    {
      type: 'list',
      name: 'styling',
      message: 'Styling?',
      choices: [
        { name: 'Tailwind CSS', value: 'tailwind' },
        { name: 'CSS Modules', value: 'css-modules' },
        { name: 'Styled Components', value: 'styled-components' },
        { name: 'Sass/SCSS', value: 'sass' },
      ],
      default: 'tailwind',
    },
    {
      type: 'list',
      name: 'uiLibrary',
      message: 'UI Component Libraries?',
      choices: [
        { name: 'MUI (Material UI)', value: 'mui' },
        { name: 'Ant Design', value: 'antd' },
        { name: 'Chakra UI', value: 'chakra' },
        { name: 'shadcn/ui', value: 'shadcn' },
        { name: 'Headless UI', value: 'headless-ui' },
        { name: 'None', value: 'none' },
      ],
      default: 'shadcn',
    },
    {
      type: 'list',
      name: 'unitTesting',
      message: 'Unit Testing?',
      choices: [
        { name: 'Vitest + React Testing Library', value: 'vitest' },
        { name: 'Jest + React Testing Library', value: 'jest' },
        { name: 'None', value: 'none' },
      ],
      default: 'vitest',
    },
    {
      type: 'list',
      name: 'e2eTesting',
      message: 'E2E Testing?',
      choices: [
        { name: 'Playwright', value: 'playwright' },
        { name: 'Cypress', value: 'cypress' },
        { name: 'None', value: 'none' },
      ],
      default: 'playwright',
    },
    {
      type: 'list',
      name: 'visualTesting',
      message: 'Component Dev / Visual Testing?',
      choices: [
        { name: 'Storybook', value: 'storybook' },
        { name: 'Chromatic', value: 'chromatic' },
        { name: 'None', value: 'none' },
      ],
      default: 'storybook',
    },
    {
      type: 'list',
      name: 'linting',
      message: 'Linting & formatting?',
      choices: [
        { name: 'ESLint + Prettier', value: 'eslint' },
        { name: 'Biome (lint + format)', value: 'biome' },
      ],
      default: 'eslint',
    },
    {
      type: 'list',
      name: 'apiLayer',
      message: 'API Layer?',
      when: (answers: { stateManagement?: string; serverState?: string }) =>
        answers.stateManagement !== 'redux' && answers.serverState !== 'rtk-query',
      choices: [
        { name: 'REST via Axios', value: 'axios' },
        { name: 'REST via Fetch', value: 'fetch' },
      ],
      default: 'axios',
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package Manager?',
      choices: [
        { name: 'pnpm', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'npm workspaces', value: 'npm' },
      ],
      default: 'pnpm',
    },
    {
      type: 'list',
      name: 'errorTracking',
      message: 'Error Tracking / Monitoring?',
      choices: [
        { name: 'Sentry', value: 'sentry' },
        { name: 'Bugsnag', value: 'bugsnag' },
        { name: 'LogRocket', value: 'logrocket' },
        { name: 'Datadog RUM', value: 'datadog' },
        { name: 'None', value: 'none' },
      ],
      default: 'sentry',
    },
  ]);

  // ESLint pairs with Prettier; Biome already formats — no separate formatter prompt
  const formatting: ProjectAnswers['formatting'] =
    stack.linting === 'biome' ? 'none' : 'prettier';

  // Redux Toolkit always uses RTK Query — skip the server-state prompt
  const serverState: ProjectAnswers['serverState'] =
    stack.stateManagement === 'redux' ? 'rtk-query' : (stack.serverState ?? 'tanstack-query');

  // RTK Query already provides HTTP (fetchBaseQuery) — skip a separate axios/fetch client
  const apiLayer: ProjectAnswers['apiLayer'] =
    serverState === 'rtk-query' ? 'none' : (stack.apiLayer ?? 'axios');

  const { installDependencies } = await inquirer.prompt<{
    installDependencies: boolean;
  }>([
    {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Install dependencies now?',
      default: true,
    },
  ]);

  return {
    projectName,
    targetDir,
    ...stack,
    serverState,
    formatting,
    apiLayer,
    installDependencies,
  };
}
