# create-react-starter-kit

Interactive CLI that scaffolds a **production-ready React app** from terminal prompts. Each answer shapes dependencies, configs, a working demo page, and documentation.

## Install

```bash
# Global
npm install -g create-react-starter-kit
create-react-starter-kit

# Or one-shot
npx create-react-starter-kit
```

## Usage

### Interactive (default)

```bash
create-react-starter-kit
```

Answer questions one by one (build tool, language, router, state, data fetching, forms, styling, testing, and more). Press **Enter** to accept each default. Every project includes **Husky + lint-staged + commitlint**, a **feature-based** folder layout, and **`@/` path aliases**.

### Non-interactive defaults

```bash
create-react-starter-kit --defaults --name my-app
create-react-starter-kit -y --name my-app --dir ./apps/my-app --skip-install
```

| Flag | Description |
|------|-------------|
| `-y`, `--yes`, `--defaults` | Use recommended defaults |
| `-n`, `--name <name>` | Project name |
| `-d`, `--dir <path>` | Output directory |
| `--skip-install` | Skip dependency install |
| `-h`, `--help` | Show help |

## What gets generated

- Complete React app with navigation, layout, and demo panels
- Real examples for selected state, data fetching, forms, validation, UI, and API layers
- `docs/` with architecture, getting started, best practices, and stack notes
- Tooling configs (Vite/Webpack/Rspack/Parcel/esbuild/Rollup, ESLint/Biome, Prettier, tests, etc.)
- Husky pre-commit (lint-staged) + commit-msg (commitlint / Conventional Commits)
- Feature-based `src/` layout + `@/` path aliases (tsconfig + bundler)
- `README.md` tailored to the selected stack

## Develop this package

```bash
git clone <repo>
cd create-react-starter-kit
npm install
npm run build
npm start
# or
node bin/create-react-starter-kit.js --defaults --name demo --dir ./tmp-generated/demo --skip-install
```

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Compile TypeScript and copy templates |
| `npm start` | Run the CLI |
| `npm run validate` | Build + generate a sample project under `tmp-generated/` |
| `npm run typecheck` | Typecheck without emit |

### Local validation before publish

```bash
npm run validate
```

This generates `tmp-generated/validation-app` with default stack options and asserts key files exist. Optionally install and run that app:

```bash
cd tmp-generated/validation-app
pnpm install
pnpm dev
```

## Package layout

```text
bin/                      CLI entry
src/                      TypeScript source (prompts, generator, utils)
templates/                EJS templates for generated apps
scripts/                  copy-templates + validate-cli
dist/                     Compiled output (published)
```

Templates use `__when_<key>_<value>__/` folders and EJS conditionals so only matching configs and examples are emitted.

## Publishing to npm

1. Update `version` in `package.json` (semver).
2. Run `npm run validate` and smoke-test a generated app.
3. Ensure you are logged in: `npm login`
4. Publish:

```bash
npm publish --access public
```

5. Verify:

```bash
npx create-react-starter-kit@latest --help
```

See [docs/PUBLISHING.md](docs/PUBLISHING.md) for a fuller checklist.

## License

MIT
