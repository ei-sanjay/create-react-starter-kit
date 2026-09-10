# Publishing checklist

## Before you publish

1. **Bump version** in `package.json` following [semver](https://semver.org/).
2. **Build & validate**

   ```bash
   npm run validate
   ```

3. **Smoke-test a generated app**

   ```bash
   cd tmp-generated/validation-app
   pnpm install   # or npm / yarn
   pnpm dev
   pnpm test
   pnpm build
   ```

4. Confirm `package.json` `files` includes `bin`, `dist`, and `templates`.
5. Confirm `bin/create-react-starter-kit.js` has a shebang and is executable.

## Publish

npm requires **2FA** or a **granular access token** to publish.

### Option A — Enable 2FA (recommended)

1. Go to [npmjs.com](https://www.npmjs.com/) → Account → **Two-Factor Authentication**
2. Enable 2FA (at least for auth-and-writes / publishing)
3. Re-login and publish:

```bash
npm logout
npm login
npm publish --access public
```

When prompted, enter your OTP from the authenticator app.

### Option B — Granular access token

1. npmjs.com → Access Tokens → **Generate New Token** → **Granular Access Token**
2. Permissions: **Read and write** for packages (and allow publish / bypass 2FA if shown)
3. Copy the token, then:

```bash
npm logout
npm login --auth-type=legacy
# Or set the token directly:
npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE

npm publish --access public
```

### Then publish

```bash
npm publish --access public
```

For a dry run:

```bash
npm pack
tar -tzf create-react-starter-kit-*.tgz | head
```

## After publish

```bash
npx create-react-starter-kit@latest --defaults --name smoke --skip-install
```

Tag the release in git if you use tags:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Unpublish / deprecate

Prefer `npm deprecate` over unpublish for versions already in use:

```bash
npm deprecate create-react-starter-kit@"<1.0.1" "Please upgrade to 1.0.1+"
```
