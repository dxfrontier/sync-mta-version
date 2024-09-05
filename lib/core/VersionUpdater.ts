import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

import { constants } from '../constants/constants';
import { util } from '../util/util';

// import { Command } from 'commander';

import type { VersionProp, Paths, CliFiles } from '../util/types';
import { CliRead } from '../util/helpers/CliRead';

/**
 * Class representing a version updater for synchronizing version information
 * between `package.json` and `mta.yaml` files.
 */
export class VersionUpdater {
  private readonly paths: Paths = Object.create({});
  private readonly currentDirectory: string;
  private files: CliFiles;

  constructor() {
    this.files = new CliRead().getFiles();
    this.currentDirectory = process.cwd();
    this.paths = this.initializePaths();
  }

  /**
   * Initializes and returns paths to the `package.json` and `mta.yaml` files.
   * @private
   */
  private initializePaths(): Paths {
    return {
      package: path.resolve(this.currentDirectory, constants.PACKAGE),
      mta: path.resolve(this.currentDirectory, this.files.file),
    };
  }

  /**
   * Reads and parses JSON or YAML file.
   * @private
   */
  private readFile<T>(filePath: string): T {
    const content = fs.readFileSync(filePath, constants.UTF_8);
    return filePath.endsWith('.json') ? JSON.parse(content) : YAML.parse(content);
  }

  /**
   * Writes content to the specified YAML file.
   * @private
   */
  private writeYamlFile(filePath: string, content: object): boolean {
    try {
      const yamlContent = YAML.stringify(content);
      fs.writeFileSync(filePath, yamlContent, constants.UTF_8);
      return true;
    } catch (error) {
      util.showConsoleMessage(error as any);
      return false;
    }
  }

  /**
   * Updates the version in the specified YAML file to match the version in `package.json`.
   * @private
   */
  private updateFileVersion(filePath: string): VersionProp {
    const packageVersion: VersionProp = this.readFile<VersionProp>(this.paths.package);
    const yamlFile: VersionProp = this.readFile<VersionProp>(filePath);

    yamlFile.version = packageVersion.version;

    return yamlFile;
  }

  /**
   * Synchronizes version in `mta.yaml` with `package.json`.
   * @private
   */
  private syncMTAVersion(): boolean {
    const updatedMTA = this.updateFileVersion(this.paths.mta);
    return this.writeYamlFile(this.paths.mta, updatedMTA);
  }

  /**
   * Optionally synchronizes the version in extension files with `package.json` if provided.
   * @private
   */
  private syncMTAExtensions(): boolean {
    // If no extensions provided, skip
    if (!this.files.extension) {
      return false;
    }

    let allUpdated = true;

    this.files.extension.forEach((extensionFile) => {
      const extPath = path.resolve(this.currentDirectory, extensionFile);
      const updatedExt = this.updateFileVersion(extPath);
      const isExtUpdated = this.writeYamlFile(extPath, updatedExt);

      if (!isExtUpdated) {
        allUpdated = false;
      }
    });

    return allUpdated;
  }

  /**
   * Synchronizes the version between `package.json`, `mta.yaml`, and optional extensions.
   * Displays success or failure messages based on the result.
   * @public
   */
  public syncVersion(): void {
    const isMtaUpdated = this.syncMTAVersion();
    const areExtensionsUpdated = this.syncMTAExtensions();

    if (isMtaUpdated) {
      util.showConsoleMessage(constants.MESSAGES.SUCCESS);

      if (areExtensionsUpdated && this.files.extension) {
        util.showConsoleMessage(constants.MESSAGES.SUCCESS_EXTENSIONS);
      }

      return;
    }

    util.showConsoleMessage(constants.MESSAGES.FAIL);
  }
}
