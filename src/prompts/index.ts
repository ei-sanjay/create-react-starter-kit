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
    Omit<ProjectAnswers, 'projectName' | 'targetDir' | 'installDependencies'>
  >([
    {
      type: 'list',
      name: 'buildTool',
      message: 'What build tool do you want to use?',
      choices: [
        { name: 'Vite', value: 'vite' },
        { name: 'Webpack', value: 'webpack' },
        { name: 'Rspack', value: 'rspack' },
        { name: 'Parcel', value: 'parcel' },
        { name: 'esbuild', value: 'esbuild' },
        { name: 'Rollup', value: 'rollup' },
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
      choices: (answers: { stateManagement?: string }) => {
        const choices = [
          { name: 'TanStack Query', value: 'tanstack-query' },
          { name: 'SWR', value: 'swr' },
          { name: 'None', value: 'none' },
        ];
        if (answers.stateManagement === 'redux') {
          choices.splice(2, 0, { name: 'RTK Query', value: 'rtk-query' });
        }
        return choices;
      },
      default: (answers: { stateManagement?: string }) =>
        answers.stateManagement === 'redux' ? 'rtk-query' : 'tanstack-query',
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
        { name: 'Vitest', value: 'vitest' },
        { name: 'Jest', value: 'jest' },
        { name: 'React Testing Library (RTL) only', value: 'rtl' },
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
      message: 'Linting / Formatting?',
      choices: [
        { name: 'ESLint', value: 'eslint' },
        { name: 'Biome', value: 'biome' },
      ],
      default: 'eslint',
    },
    {
      type: 'list',
      name: 'formatting',
      message: 'Formatting?',
      choices: [
        { name: 'Prettier', value: 'prettier' },
        { name: 'Stylelint', value: 'stylelint' },
      ],
      default: 'prettier',
    },
    {
      type: 'list',
      name: 'apiLayer',
      message: 'API Layer?',
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

  // Safety: RTK Query requires Redux Toolkit
  if (stack.serverState === 'rtk-query' && stack.stateManagement !== 'redux') {
    stack.serverState = 'tanstack-query';
  }

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
    installDependencies,
  };
}
