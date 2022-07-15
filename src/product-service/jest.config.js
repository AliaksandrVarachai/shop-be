import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __rootDir = path.parse(__filename).dir;

export default {
  verbose: true,
  automock: false,
  collectCoverage: true,
  coverageDirectory: './coverage',
  setupFiles: [
    path.join(__rootDir, '.jest/set-environment-variables.js'),
  ],
};
