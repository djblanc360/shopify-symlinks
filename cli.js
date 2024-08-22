import path from 'path';

import config from './config.js';
import { ensureDirectoryExists, updateShopifyIgnore } from './utils.js';
// import { runService } from './index.js';

import { Command } from 'commander';
const program = new Command();

program
  .option('-e, --entry <path>', 'Set the entry point for the service')
  .option('-w, --watch <dirs>', 'Set additional directories to watch, separated by commas', (val) => val.split(','))
  .action(async (options) => {
    if (options.entry) {
      config.entryJs = path.resolve(options.entry);
    }

    if (options.watch) {
      options.watch.forEach((dir) => {
        const resolvedDir = path.resolve(dir);
        ensureDirectoryExists(resolvedDir);
        if (!config.watchDir.has(resolvedDir)) {
          config.watchDir.set(resolvedDir, {
            source: resolvedDir,
            destination: path.join(config.assetsDir, `${path.basename(dir)}.js`),
          });
        }
      });
    }


    const componentsDir = path.join(__dirname, 'components');
    ensureDirectoryExists(componentsDir);


    // default 'utilities' directory and 'utils.js' file
    const utilitiesDir = path.join(__dirname, 'utilities');
    ensureDirectoryExists(utilitiesDir);
    if (!config.watchDir.has(utilitiesDir)) {
      config.watchDir.set(utilitiesDir, {
        source: utilitiesDir,
        destination: path.join(config.assetsDir, 'utils.js'),
      });
    }

    const WATCHED_DIRS = Array.from(config.watchDir.keys());
    await updateShopifyIgnore(WATCHED_DIRS);

    const { runService } = await import('./index.js');
    runService(config);
  });

program.parse(process.argv);