import path from 'node:path';
import validateNpmPackageName from 'validate-npm-package-name';

export function validateProjectName(name: string): true | string {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Project name is required.';
  }

  if (/[\\/]/.test(trimmed)) {
    return 'Project name cannot contain path separators.';
  }

  const result = validateNpmPackageName(trimmed);
  if (!result.validForNewPackages) {
    const problems = [...(result.errors ?? []), ...(result.warnings ?? [])];
    return problems[0] ?? 'Invalid project name.';
  }

  return true;
}

export function resolveTargetDirectory(
  cwd: string,
  projectName: string,
  customPath?: string,
): string {
  if (customPath?.trim()) {
    return path.resolve(cwd, customPath.trim());
  }
  return path.resolve(cwd, projectName);
}
