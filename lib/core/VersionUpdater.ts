import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

import { constants } from '../constants/constants';
import { util } from '../util/util';

import type { VersionProp, Paths } from '../util/types';

/**
 * Class representing a version updater for synchronizing version information
 * between `package.json` and `mta.yaml` files.
 */
export class VersionUpdater {
  /**
   * Holds the paths to relevant files.
   * @private
   */
  private readonly paths: Paths = Object.create({});

  /**
   * The current working directory.
   * @private
   */
  private readonly currentDirectory: string;

  /**
   * Initializes the `VersionUpdater` class.
   * Sets the current working directory and initializes file paths.
   */
  constructor() {
    this.currentDirectory = process.cwd();
    this.paths = this.initializePaths();
  }

  /**
   * Initializes and returns the paths to `package.json` and `mta.yaml` files.
   * @private
   * @returns {Paths} The resolved paths for `package.json` and `mta.yaml`.
   */
  private initializePaths(): Paths {
    return {
      package: path.resolve(this.currentDirectory, constants.PACKAGE),
      mta: path.resolve(this.currentDirectory, constants.MTA),
    };
  }

  /**
   * Reads and parses the `package.json` file.
   * @private
   * @returns {VersionProp} The parsed content of the `package.json` file.
   */
  private readPackageJsonFile(): VersionProp {
    const content = fs.readFileSync(this.paths.package, constants.UTF_8);
    return JSON.parse(content);
  }

  /**
   * Reads and parses the `mta.yaml` file.
   * @private
   * @returns {VersionProp} The parsed content of the `mta.yaml` file.
   */
  private readYamlFile(): VersionProp {
    const content = fs.readFileSync(this.paths.mta, constants.UTF_8);
    return YAML.parse(content);
  }

  /**
   * Writes the provided content to the `mta.yaml` file.
   * @private
   * @param {object} content - The content to write to the `mta.yaml` file.
   * @returns {boolean} `true` if the file was written successfully, `false` otherwise.
   */
  private writeYamlFile(content: object): boolean {
    try {
      const yamlContent = YAML.stringify(content);
      fs.writeFileSync(this.paths.mta, yamlContent, constants.UTF_8);
      return true;
    } catch (error) {
      util.showConsoleMessage(error as any);
      return false;
    }
  }

  /**
   * Updates the version in the `mta.yaml` file to match the version in the `package.json` file.
   * @private
   * @returns {VersionProp} The updated `mta.yaml` content with the new version.
   */
  private updateMTAVersion(): VersionProp {
    const newVersion: VersionProp = this.readPackageJsonFile();
    const mtaYaml: VersionProp = this.readYamlFile();

    mtaYaml.version = newVersion.version;

    return mtaYaml;
  }

  /**
   * Synchronizes the version number between `package.json` and `mta.yaml` by updating
   * the `mta.yaml` file with the version from `package.json`.
   * Displays a success or failure message based on the outcome.
   * @public
   */
  public syncVersion(): void {
    const updatedMTA = this.updateMTAVersion();
    const isUpdated = this.writeYamlFile(updatedMTA);
    const messages = {
      success: `The version in 'mta.yaml' has been successfully updated to ${updatedMTA.version}.`,
      fail: `Failed to update the version in 'mta.yaml'. Please check the file and try again.`,
    };

    if (isUpdated) {
      util.showConsoleMessage(messages.success);
      return;
    }

    util.showConsoleMessage(messages.fail);
  }
}
