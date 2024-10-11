import * as YAML from 'yaml';
import * as fs from 'fs';

import colors from 'picocolors';

import { constants } from '../constants/constants';

export const util = {
  showConsoleMessage(message: string) {
    console.log(message);
  },

  createMessage(success: boolean, fileName: string) {
    const status = success ? colors.green : colors.red;

    return {
      message: status(
        `The version in ${fileName} has ${success ? '' : 'not '}been successfully synchronized with the main ${'package.json'} version.`,
      ),
      messageAll: status(
        `All ${`*.${fileName}`} files have ${success ? '' : 'not '}been successfully synchronized with the main ${'package.json'} version.`,
      ),
    };
  },

  displayUpdateMessage(updated: boolean, successMessage: string, failureMessage: string): void {
    return updated ? util.showConsoleMessage(successMessage) : util.showConsoleMessage(failureMessage);
  },

  /**
   * Reads and parses JSON or YAML file.
   */
  readFile<T>(filePath: string): T {
    const content = fs.readFileSync(filePath, constants.UTF_8);
    return filePath.endsWith('.json') ? JSON.parse(content) : YAML.parse(content);
  },

  /**
   * Writes content to the specified YAML or JSON file.
   */
  writeFile(filePath: string, content: any): boolean {
    try {
      let fileContent: string;

      if (filePath.endsWith('.json')) {
        fileContent = JSON.stringify(content, null, 2); // Pretty-print JSON with 2-space indentation
      } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml') || filePath.endsWith('.mtaext')) {
        fileContent = YAML.stringify(content);
      } else {
        throw new Error('Unsupported file type. Only JSON and YAML are supported.');
      }

      fs.writeFileSync(filePath, fileContent, constants.UTF_8);

      return true;
    } catch (error) {
      util.showConsoleMessage(`Error writing file: ${filePath} - ${error}`);
      return false;
    }
  },
};
