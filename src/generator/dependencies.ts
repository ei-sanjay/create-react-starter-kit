import type { ProjectAnswers } from '../types.js';

export interface DependencySets {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

const REACT = {
  react: '^19.0.0',
  'react-dom': '^19.0.0',
};

export function resolveDependencies(answers: ProjectAnswers): DependencySets {
  const dependencies: Record<string, string> = { ...REACT };
  const devDependencies: Record<string, string> = {};

  const isTs = answers.language === 'typescript';

  // Build tools
  switch (answers.buildTool) {
    case 'vite':
      dependencies['@vitejs/plugin-react'] = '^4.3.4';
      // plugin is typically a dep for simplicity in scaffolds; keep as dep so vite works
      delete dependencies['@vitejs/plugin-react'];
      devDependencies['vite'] = '^6.2.2';
      devDependencies['@vitejs/plugin-react'] = '^4.3.4';
      break;
    case 'webpack':
      devDependencies['webpack'] = '^5.98.0';
      devDependencies['webpack-cli'] = '^6.0.1';
      devDependencies['webpack-dev-server'] = '^5.2.0';
      devDependencies['html-webpack-plugin'] = '^5.6.3';
      devDependencies['css-loader'] = '^7.1.2';
      devDependencies['style-loader'] = '^4.0.0';
      devDependencies['babel-loader'] = '^9.2.1';
      devDependencies['@babel/core'] = '^7.26.10';
      devDependencies['@babel/preset-env'] = '^7.26.9';
      devDependencies['@babel/preset-react'] = '^7.26.3';
      devDependencies['dotenv'] = '^16.4.7';
      devDependencies['copy-webpack-plugin'] = '^12.0.2';
      if (isTs) {
        devDependencies['@babel/preset-typescript'] = '^7.26.0';
      }
      if (answers.styling === 'tailwind' || answers.uiLibrary === 'shadcn') {
        devDependencies['postcss-loader'] = '^8.1.1';
      }
      if (answers.styling === 'sass') {
        devDependencies['sass-loader'] = '^16.0.5';
      }
      break;
    case 'rspack':
      devDependencies['@rspack/core'] = '^1.2.8';
      devDependencies['@rspack/cli'] = '^1.2.8';
      devDependencies['@rspack/plugin-react-refresh'] = '^1.0.1';
      devDependencies['html-rspack-plugin'] = '^6.0.2';
      break;
    case 'parcel':
      devDependencies['parcel'] = '^2.14.1';
      break;
    case 'esbuild':
      devDependencies['esbuild'] = '^0.25.1';
      break;
    case 'rollup':
      devDependencies['rollup'] = '^4.35.0';
      devDependencies['@rollup/plugin-node-resolve'] = '^16.0.1';
      devDependencies['@rollup/plugin-commonjs'] = '^28.0.3';
      devDependencies['@rollup/plugin-replace'] = '^6.0.2';
      devDependencies['@rollup/plugin-alias'] = '^5.1.1';
      if (isTs) {
        devDependencies['@rollup/plugin-typescript'] = '^12.1.2';
      }
      devDependencies['rollup-plugin-postcss'] = '^4.0.2';
      break;
  }

  if (isTs) {
    devDependencies['typescript'] = '^5.8.2';
    devDependencies['@types/react'] = '^19.0.10';
    devDependencies['@types/react-dom'] = '^19.0.4';
  }

  // Router
  if (answers.router === 'react-router') {
    dependencies['react-router-dom'] = '^7.3.0';
  } else {
    dependencies['@tanstack/react-router'] = '^1.114.25';
  }

  // State
  switch (answers.stateManagement) {
    case 'redux':
      dependencies['@reduxjs/toolkit'] = '^2.6.1';
      dependencies['react-redux'] = '^9.2.0';
      break;
    case 'zustand':
      dependencies['zustand'] = '^5.0.3';
      break;
    case 'jotai':
      dependencies['jotai'] = '^2.12.2';
      break;
  }

  // Server state
  switch (answers.serverState) {
    case 'tanstack-query':
      dependencies['@tanstack/react-query'] = '^5.68.0';
      break;
    case 'swr':
      dependencies['swr'] = '^2.3.3';
      break;
    case 'rtk-query':
      // RTK Query is only offered when Redux Toolkit is selected.
      break;
  }

  // Forms
  switch (answers.forms) {
    case 'react-hook-form':
      dependencies['react-hook-form'] = '^7.54.2';
      if (answers.validation === 'zod') {
        dependencies['@hookform/resolvers'] = '^4.1.3';
      }
      break;
    case 'formik':
      dependencies['formik'] = '^2.4.6';
      break;
    case 'tanstack-form':
      dependencies['@tanstack/react-form'] = '^1.1.0';
      break;
  }

  // Validation
  switch (answers.validation) {
    case 'zod':
      dependencies['zod'] = '^3.24.2';
      break;
    case 'yup':
      dependencies['yup'] = '^1.6.1';
      break;
    case 'valibot':
      dependencies['valibot'] = '^1.0.0';
      break;
    case 'joi':
      dependencies['joi'] = '^17.13.3';
      break;
  }

  // Styling
  switch (answers.styling) {
    case 'tailwind':
      devDependencies['tailwindcss'] = '^3.4.17';
      devDependencies['postcss'] = '^8.5.3';
      devDependencies['autoprefixer'] = '^10.4.21';
      break;
    case 'styled-components':
      dependencies['styled-components'] = '^6.1.15';
      if (isTs) {
        devDependencies['@types/styled-components'] = '^5.1.34';
      }
      break;
    case 'sass':
      devDependencies['sass'] = '^1.85.1';
      break;
  }

  // UI libraries
  switch (answers.uiLibrary) {
    case 'mui':
      dependencies['@mui/material'] = '^6.4.7';
      dependencies['@emotion/react'] = '^11.14.0';
      dependencies['@emotion/styled'] = '^11.14.0';
      dependencies['@mui/icons-material'] = '^6.4.7';
      break;
    case 'antd':
      dependencies['antd'] = '^5.24.3';
      break;
    case 'chakra':
      dependencies['@chakra-ui/react'] = '^3.13.0';
      dependencies['@emotion/react'] = '^11.14.0';
      dependencies['@emotion/styled'] = '^11.14.0';
      dependencies['framer-motion'] = '^12.5.0';
      break;
    case 'shadcn':
      dependencies['class-variance-authority'] = '^0.7.1';
      dependencies['clsx'] = '^2.1.1';
      dependencies['tailwind-merge'] = '^3.0.2';
      dependencies['lucide-react'] = '^0.482.0';
      if (answers.styling !== 'tailwind') {
        devDependencies['tailwindcss'] = '^3.4.17';
        devDependencies['postcss'] = '^8.5.3';
        devDependencies['autoprefixer'] = '^10.4.21';
      }
      break;
    case 'headless-ui':
      dependencies['@headlessui/react'] = '^2.2.0';
      dependencies['@heroicons/react'] = '^2.2.0';
      break;
  }

  // Unit testing
  switch (answers.unitTesting) {
    case 'vitest':
      devDependencies['vitest'] = '^3.0.8';
      devDependencies['@testing-library/react'] = '^16.2.0';
      devDependencies['@testing-library/jest-dom'] = '^6.6.3';
      devDependencies['@testing-library/user-event'] = '^14.6.1';
      devDependencies['jsdom'] = '^26.0.0';
      break;
    case 'jest':
      devDependencies['jest'] = '^29.7.0';
      devDependencies['jest-environment-jsdom'] = '^29.7.0';
      devDependencies['@testing-library/react'] = '^16.2.0';
      devDependencies['@testing-library/jest-dom'] = '^6.6.3';
      devDependencies['@testing-library/user-event'] = '^14.6.1';
      if (isTs) {
        devDependencies['ts-jest'] = '^29.2.6';
        devDependencies['@types/jest'] = '^29.5.14';
      }
      break;
    case 'rtl':
      devDependencies['@testing-library/react'] = '^16.2.0';
      devDependencies['@testing-library/jest-dom'] = '^6.6.3';
      devDependencies['@testing-library/user-event'] = '^14.6.1';
      break;
  }

  // E2E
  switch (answers.e2eTesting) {
    case 'playwright':
      devDependencies['@playwright/test'] = '^1.51.0';
      break;
    case 'cypress':
      devDependencies['cypress'] = '^14.2.0';
      break;
  }

  // Visual
  switch (answers.visualTesting) {
    case 'storybook':
      devDependencies['storybook'] = '^8.6.4';
      devDependencies['@storybook/react'] = '^8.6.4';
      devDependencies['@storybook/addon-essentials'] = '^8.6.4';
      if (answers.buildTool === 'vite' || answers.buildTool === 'esbuild') {
        devDependencies['@storybook/react-vite'] = '^8.6.4';
      } else {
        devDependencies['@storybook/react-webpack5'] = '^8.6.4';
        // Storybook 8 webpack builder needs an explicit compiler for TS/JSX.
        devDependencies['@storybook/addon-webpack5-compiler-babel'] = '^3.0.5';
      }
      devDependencies['@storybook/test'] = '^8.6.4';
      break;
    case 'chromatic':
      devDependencies['chromatic'] = '^11.27.0';
      break;
  }

  // Linting
  if (answers.linting === 'eslint') {
    devDependencies['eslint'] = '^9.22.0';
    devDependencies['@eslint/js'] = '^9.22.0';
    devDependencies['globals'] = '^16.0.0';
    devDependencies['eslint-plugin-react'] = '^7.37.4';
    devDependencies['eslint-plugin-react-hooks'] = '^5.2.0';
    if (isTs) {
      devDependencies['typescript-eslint'] = '^8.26.1';
    }
    if (answers.formatting === 'prettier') {
      devDependencies['eslint-config-prettier'] = '^10.1.1';
    }
  } else {
    devDependencies['@biomejs/biome'] = '^1.9.4';
  }

  // Formatting
  if (answers.formatting === 'prettier') {
    devDependencies['prettier'] = '^3.5.3';
  } else {
    devDependencies['stylelint'] = '^16.16.0';
    devDependencies['stylelint-config-standard'] = '^37.0.0';
  }

  // API
  if (answers.apiLayer === 'axios') {
    dependencies['axios'] = '^1.8.3';
  }

  // Error tracking
  switch (answers.errorTracking) {
    case 'sentry':
      dependencies['@sentry/react'] = '^9.5.0';
      break;
    case 'bugsnag':
      dependencies['@bugsnag/js'] = '^8.2.0';
      dependencies['@bugsnag/plugin-react'] = '^8.2.0';
      break;
    case 'logrocket':
      dependencies['logrocket'] = '^9.0.2';
      break;
    case 'datadog':
      dependencies['@datadog/browser-rum'] = '^6.4.0';
      break;
  }

  // Git hooks — always included (Husky + lint-staged + commitlint)
  devDependencies['husky'] = '^9.1.7';
  devDependencies['lint-staged'] = '^15.5.0';
  devDependencies['@commitlint/cli'] = '^19.8.0';
  devDependencies['@commitlint/config-conventional'] = '^19.8.0';

  return { dependencies, devDependencies };
}

export function buildScripts(answers: ProjectAnswers): Record<string, string> {
  const scripts: Record<string, string> = {};
  const isTs = answers.language === 'typescript';
  const entry = isTs ? 'src/main.tsx' : 'src/main.jsx';

  switch (answers.buildTool) {
    case 'vite':
      scripts.dev = 'vite';
      scripts.build = 'vite build';
      scripts.preview = 'vite preview';
      break;
    case 'webpack':
      scripts.dev = 'webpack serve --mode development';
      scripts.build = 'webpack --mode production';
      scripts.preview = 'webpack serve --mode production --open';
      break;
    case 'rspack':
      scripts.dev = 'rspack serve';
      scripts.build = 'rspack build';
      break;
    case 'parcel':
      scripts.dev = 'parcel index.html';
      scripts.build = 'parcel build index.html';
      break;
    case 'esbuild':
      scripts.dev = `node scripts/esbuild.dev.mjs`;
      scripts.build = `node scripts/esbuild.build.mjs`;
      break;
    case 'rollup':
      scripts.dev = 'rollup -c -w';
      scripts.build = 'rollup -c';
      break;
  }

  if (answers.linting === 'eslint') {
    scripts.lint = isTs
      ? 'eslint src --ext .ts,.tsx'
      : 'eslint src --ext .js,.jsx';
  } else {
    scripts.lint = 'biome check .';
    scripts['lint:fix'] = 'biome check --write .';
  }

  if (answers.formatting === 'prettier') {
    const srcExt =
      answers.language === 'typescript' ? 'ts,tsx' : 'js,jsx';
    const prettierGlobs = [
      `"src/**/*.{${srcExt},css,scss,md,json}"`,
      `"tests/**/*.{${srcExt}}"`,
      '"docs/**/*.md"',
      '"*.{json,md,cjs,mjs,ts,js}"',
    ];
    if (answers.visualTesting === 'storybook') {
      prettierGlobs.push('".storybook/**/*.{js,cjs,mjs,ts,tsx}"');
    }
    if (answers.e2eTesting === 'cypress') {
      prettierGlobs.push(`"cypress/**/*.{${srcExt}}"`);
    }
    const joined = prettierGlobs.join(' ');
    scripts.format = `prettier --write ${joined}`;
    scripts['format:check'] = `prettier --check ${joined}`;
  } else {
    scripts.format = 'stylelint "src/**/*.{css,scss}" --fix';
  }

  switch (answers.unitTesting) {
    case 'vitest':
      scripts.test = 'vitest run';
      scripts['test:watch'] = 'vitest';
      break;
    case 'jest':
      scripts.test = 'jest';
      scripts['test:watch'] = 'jest --watch';
      break;
    case 'rtl':
      scripts.test = 'echo "Configure your test runner for RTL"';
      break;
  }

  if (answers.e2eTesting === 'playwright') {
    scripts['test:e2e'] = 'playwright test';
    scripts['test:e2e:ui'] = 'playwright test --ui';
    scripts['test:e2e:install'] = 'playwright install chromium';
  } else if (answers.e2eTesting === 'cypress') {
    scripts['test:e2e'] = 'cypress run';
    scripts['cypress:open'] = 'cypress open';
  }

  if (answers.visualTesting === 'storybook') {
    scripts.storybook = 'storybook dev -p 6006';
    scripts['build-storybook'] = 'storybook build';
  } else if (answers.visualTesting === 'chromatic') {
    scripts.chromatic = 'chromatic --exit-zero-on-changes';
  }

  scripts.prepare = 'husky';

  // silence unused
  void entry;

  return scripts;
}
