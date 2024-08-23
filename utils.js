import fs from 'fs/promises';
import path from 'path';

/**
 * Logs a formatted message with simplified file paths.
 * @param {string} messageTemplate - The message template containing placeholders for paths.
 * @param {...string} paths - The file paths to format and include in the message.
 */
const terminalLogs = (message, ...paths) => {
    const formattedPaths = paths.map(filePath => {
        if (filePath instanceof Error) {
            return `Filepath error: ${filePath.message}`;
        } else if (typeof filePath === 'string') {
            return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
        } else {
            return String(filePath); // Fallback to convert other types to string
        }
    });

    const formattedMessage = message.replace(/\{(\d+)\}/g, (match, index) => {
        return formattedPaths[index];
    });

    console.log(formattedMessage);
}

const debounce = (func, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    terminalLogs("Directory ensured: {0}", dirPath);
  } catch (err) {
    terminalLogs("Error ensuring directory {0}: {1}", dirPath, err.message);
  }
};

export const updateShopifyIgnore = async (directories) => {
  const SHOPIFY_IGNORE_PATH = path.join(process.cwd(), '.shopifyignore');
  let ignoreContent = '';

  try {
    if (await fs.access(SHOPIFY_IGNORE_PATH).then(() => true).catch(() => false)) {
      ignoreContent = await fs.readFile(SHOPIFY_IGNORE_PATH, 'utf8');
    } else {
      await fs.writeFile(SHOPIFY_IGNORE_PATH, '', 'utf8');
      terminalLogs("Created .shopifyignore file at: {0}", SHOPIFY_IGNORE_PATH);
    }

    await Promise.all(directories.map(async (dir) => {
      const relativeDir = path.relative(process.cwd(), dir);
      if (!ignoreContent.includes(relativeDir)) {
        await fs.appendFile(SHOPIFY_IGNORE_PATH, `${relativeDir}\n`, 'utf8');
        terminalLogs("Added {0} to .shopifyignore", relativeDir);
      }
    }));
  } catch (err) {
    terminalLogs("Error updating .shopifyignore: {0}", err.message);
  }
};

export {
    terminalLogs,
    debounce,
    ensureDirectoryExists,
    updateShopifyIgnore
}