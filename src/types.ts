export type BuildTool = 'vite' | 'webpack' | 'rspack' | 'parcel' | 'esbuild' | 'rollup';
export type Language = 'javascript' | 'typescript';
export type Router = 'react-router' | 'tanstack-router';
export type StateManagement = 'redux' | 'zustand' | 'jotai' | 'context' | 'none';
export type ServerState = 'tanstack-query' | 'swr' | 'rtk-query' | 'none';
export type Forms = 'react-hook-form' | 'formik' | 'tanstack-form' | 'none';
export type Validation = 'zod' | 'yup' | 'valibot' | 'joi' | 'none';
export type Styling = 'tailwind' | 'css-modules' | 'styled-components' | 'sass';
export type UiLibrary =
  | 'mui'
  | 'antd'
  | 'chakra'
  | 'shadcn'
  | 'headless-ui'
  | 'none';
export type UnitTesting = 'vitest' | 'jest' | 'rtl' | 'none';
export type E2ETesting = 'playwright' | 'cypress' | 'none';
export type VisualTesting = 'storybook' | 'chromatic' | 'none';
export type Linting = 'eslint' | 'biome';
export type Formatting = 'prettier' | 'stylelint';
export type ApiLayer = 'axios' | 'fetch';
export type PackageManager = 'pnpm' | 'yarn' | 'npm';
export type ErrorTracking = 'sentry' | 'bugsnag' | 'logrocket' | 'datadog' | 'none';

export interface ProjectAnswers {
  projectName: string;
  targetDir: string;
  buildTool: BuildTool;
  language: Language;
  router: Router;
  stateManagement: StateManagement;
  serverState: ServerState;
  forms: Forms;
  validation: Validation;
  styling: Styling;
  uiLibrary: UiLibrary;
  unitTesting: UnitTesting;
  e2eTesting: E2ETesting;
  visualTesting: VisualTesting;
  linting: Linting;
  formatting: Formatting;
  apiLayer: ApiLayer;
  packageManager: PackageManager;
  errorTracking: ErrorTracking;
  installDependencies: boolean;
}

export interface TemplateContext extends ProjectAnswers {
  isTypeScript: boolean;
  ext: 'ts' | 'js';
  jsxExt: 'tsx' | 'jsx';
  year: number;
}
