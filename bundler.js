import fs from 'fs/promises';
import path from 'path';

import { terminalLogs } from './utils';

const bundleUtils = async (source, destination) => {
    try {
        const files = await fs.readdir(source);
        let bundledContent = `const Utils = {};`;

        for (const file of files) {
            const filePath = path.join(source, file);

            try {
                const fileContent = await fs.readFile(filePath, 'utf8');

                const minifiedContent = fileContent
                // Preserve template literals and remove unnecessary newlines/whitespace within them
                .replace(/(`(?:\\.|[^`])*`)/g, (match) => match.replace(/\n\s*/g, ''))
                // Remove single-line comments outside of template literals and regex
                .replace(/(^|[^\\])\/\/.*$/gm, '$1')
                // Remove multi-line comments outside of template literals and regex
                .replace(/\/\*[\s\S]*?\*\//g, '')
                // Handle regex that may contain comment-like syntax
                .replace(/\/(?:[^\\\/]|\\.)*\/[gimsuy]*/g, (match) => match)
                // Remove unnecessary spaces around symbols, but preserve necessary spaces within object literals and function calls
                .replace(/\s*([{}();,:])\s*/g, '$1')
                // Preserve spaces around colons and commas in objects
                .replace(/:\s*/g, ': ')
                .replace(/,\s*/g, ', ')
                // Ensure that strings within single quotes remain intact
                .replace(/'(.*?)'/g, "'$1'")
                // Preserve necessary spaces within function signatures, async functions, and arrow functions
                .replace(/function\s*\(/g, 'function (')
                .replace(/async\s*\(/g, 'async (')
                .replace(/=>\s*\{/g, '=> {')
                .replace(/(\w)\s*=>\s*\{/g, '$1 => {')
                // Preserve conditional comments or feature detection
                .replace(/\/\*@\s*cc_on/g, '/*@cc_on')
                // Trim leading and trailing spaces
                    .trim();

                bundledContent += `\n// ${file}\n` + minifiedContent + '\n';
                terminalLogs("Bundled:  '{0}';", filePath);
            } catch (err) {
                console.error(`Error reading or processing ${filePath}:`, err);
                terminalLogs("Error reading or processing: '{0}';", filePath, err);
            }
        }
        bundledContent += `export default Utils;`
        await fs.writeFile(destination, bundledContent);
        terminalLogs("Bundled content written to:  '{0}';", destination);
    } catch (err) {
        console.error('Error during bundling process:', err);
    }
};

export const bundler = async () => {
    const bundles = Array.from(config.watchDir.values());

    await Promise.all(
        bundles.map(({ source, destination }) => bundleUtils(source, destination))
    );
};
