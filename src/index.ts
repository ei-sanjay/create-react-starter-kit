import { collectAnswers } from './prompts/index.js';
import { generateProject, printSuccess } from './generator/index.js';
import { logger } from './utils/logger.js';
import { buildDefaultAnswers, parseArgs, printHelp } from './cli-args.js';

export async function run(argv = process.argv): Promise<void> {
  const options = parseArgs(argv);

  if (options.help) {
    printHelp();
    return;
  }

  try {
    const answers = options.defaults
      ? buildDefaultAnswers({
          name: options.name,
          dir: options.dir,
          skipInstall: options.skipInstall,
        })
      : await collectAnswers();

    if (options.defaults && options.skipInstall) {
      answers.installDependencies = false;
    }

    if (options.defaults) {
      logger.title('🚀  create-react-starter-kit');
      logger.dim(
        `Using defaults for "${answers.projectName}" → ${answers.targetDir}\n`,
      );
    }

    await generateProject(answers);
    printSuccess(answers);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Aborted:')) {
      logger.warn(error.message);
      process.exitCode = 1;
      return;
    }
    throw error;
  }
}

export type { ProjectAnswers } from './types.js';
