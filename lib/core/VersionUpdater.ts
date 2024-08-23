import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

import { constants } from '../constants/constants';
import { util } from '../util/util';

import type { VersionProp, Paths } from '../util/types';

export class VersionUpdater {
  private readonly paths: Paths = Object.create({});
  private readonly currentDirectory: string;

  constructor() {
    this.currentDirectory = process.cwd();
    this.paths = this.initializePaths();
  }

  // Private

  private initializePaths(): Paths {
    return {
      package: path.resolve(this.currentDirectory, constants.PACKAGE),
      mta: path.resolve(this.currentDirectory, constants.MTA),
    };
  }

  private readPackageJsonFile() {
    const content = fs.readFileSync(this.paths.package, constants.UTF_8);
    return JSON.parse(content);
  }

  private readYamlFile() {
    const content = fs.readFileSync(this.paths.mta, constants.UTF_8);
    return YAML.parse(content);
  }

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

  private updateMTAVersion() {
    const newVersion: VersionProp = this.readPackageJsonFile();
    const mtaYaml: VersionProp = this.readYamlFile();

    mtaYaml.version = newVersion.version;

    return mtaYaml;
  }

  // Public
  public syncVersion() {
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
