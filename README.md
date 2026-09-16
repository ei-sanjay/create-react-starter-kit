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

Answer questions one by one (build tool, router, state, data fetching, forms, styling, testing, and more). Press **Enter** to accept each default. Every project is **TypeScript** and includes **Husky git hooks**, a **feature-based** folder layout, and **`@/` path aliases**.

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
- Tooling configs (Vite/Webpack/Rsbuild, ESLint/Biome, Prettier, tests, etc.)
- Husky hooks: pre-commit (lint-staged), commit-msg (commitlint), pre-push (unit tests)
- Feature-based `src/` layout + `@/` path aliases (tsconfig + bundler)
- `README.md` tailored to the selected stack

## Git hooks in generated projects

Generated apps ship with:

| Hook | Runs |
|------|------|
| `pre-commit` | `lint-staged` (ESLint + Prettier, or Biome) |
| `commit-msg` | commitlint with Conventional Commits |
| `pre-push` | `npm run test` / `pnpm run test` / `yarn run test` |

Husky installs those hooks from the `prepare` script **during package install**. That only works if `.git` already exists.

**Required order**

```bash
git init
npm install    # or: pnpm install / yarn install
```

The generator follows the same order when it is allowed to install dependencies: `git init`, then the selected package manager’s install command.

If you pass `--skip-install`, run `git init` and then install yourself so Husky can create `.husky` internals and register the hooks.

## License

MIT
