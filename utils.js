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

export {
    terminalLogs,
    debounce
}