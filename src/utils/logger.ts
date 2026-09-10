import chalk from 'chalk';
import ora, { type Ora } from 'ora';

export const logger = {
  info(message: string): void {
    console.log(chalk.cyan('ℹ'), message);
  },
  success(message: string): void {
    console.log(chalk.green('✔'), message);
  },
  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  },
  error(message: string): void {
    console.log(chalk.red('✖'), message);
  },
  title(message: string): void {
    console.log();
    console.log(chalk.bold.magenta(message));
    console.log();
  },
  dim(message: string): void {
    console.log(chalk.dim(message));
  },
  blank(): void {
    console.log();
  },
};

export function createSpinner(text: string): Ora {
  return ora({ text, color: 'cyan' });
}
