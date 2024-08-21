import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  entryJs: path.join(__dirname, 'assets', 'main.js'), // default entry point
  watchDir: new Map(),
  componentsDir: path.join(__dirname, 'components'),
  sectionsDir: path.join(__dirname, 'sections'),
  snippetsDir: path.join(__dirname, 'snippets'),
  assetsDir: path.join(__dirname, 'assets')
};

export default config;
