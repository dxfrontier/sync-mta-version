import * as path from 'path';

import { constants } from '../constants/constants';
import { util } from '../util/util';
import { CliRead } from '../util/helpers/CliRead';
import { SyncAppsVersion } from '../util/helpers/SyncAppsVersion';

import type { VersionProp, Paths, CliFiles } from '../util/types';

/**
 * Class representing a version updater for synchronizing version information between `package.json` and `mta.yaml` files.
 */
export class VersionUpdater {
  private readonly paths: Paths = Object.create({});
  private readonly currentDirectory: string;
  private readonly files: CliFiles;
  private readonly syncAppsVersion: SyncAppsVersion;

  constructor() {
    this.files = new CliRead().getFiles();
    this.currentDirectory = process.cwd();
    this.paths = this.initializePaths();
    this.syncAppsVersion = new SyncAppsVersion(this.paths.package);
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
   * Updates the version in the specified YAML file to match the version in `package.json`.
   * @private
   */
  private updateFileVersion(filePath: string): VersionProp {
    const packageVersion: VersionProp = util.readFile<VersionProp>(this.paths.package);
    const yamlFile: VersionProp = util.readFile<VersionProp>(filePath);

    yamlFile.version = packageVersion.version;

    return yamlFile;
  }

  /**
   * Synchronizes version in `mta.yaml` with `package.json`.
   * @private
   */
  private syncMTAVersion(): boolean {
    const updatedMTA = this.updateFileVersion(this.paths.mta);
    return util.writeFile(this.paths.mta, updatedMTA);
  }

  /**
   * Synchronizes the version in extension files with `package.json`.
   * @private
   */
  private syncMTAExtensions(): boolean {
    // If no extensions provided, skip
    if (!this.files.extension) {
      return false;
    }

    let allUpdated = true;

    this.files.extension.forEach((extensionFile) => {
      const extensionPath = path.resolve(this.currentDirectory, extensionFile);
      const updatedExt = this.updateFileVersion(extensionPath);
      const isExtUpdated = util.writeFile(extensionPath, updatedExt);

      if (!isExtUpdated) {
        allUpdated = false;
      }
    });

    return allUpdated;
  }

  /**
   * Synchronizes the version between `package.json` and `mta.yaml`, `*.mtaext`, `manifest.json`
   * Displays success or failure messages based on the result.
   * @public
   */
  public syncVersion(): void {
    const isMtaUpdated = this.syncMTAVersion();

    util.displayUpdateMessage(
      isMtaUpdated,
      util.createMessage(true, 'mta.yaml').message,
      util.createMessage(false, 'mta.yaml').message,
    );

    if (this.files.extension && this.files.extension.length > 0) {
      const extensionsUpdated = this.syncMTAExtensions();

      util.displayUpdateMessage(
        extensionsUpdated,
        util.createMessage(true, 'mtaext').messageAll,
        util.createMessage(false, 'mtaext').messageAll,
      );
    }

    if (this.files.uiLocation) {
      const appFolderLocation = path.join(this.currentDirectory, this.files.uiLocation);
      const uiApp = this.syncAppsVersion.syncAppPackageAndManifestVersions(appFolderLocation);

      util.displayUpdateMessage(
        uiApp.packagesUpdated,
        util.createMessage(true, 'package.json').messageAll,
        util.createMessage(false, 'package.json').messageAll,
      );

      util.displayUpdateMessage(
        uiApp.manifestsUpdated,
        util.createMessage(true, 'manifest.json').messageAll,
        util.createMessage(false, 'manifest.json').messageAll,
      );
    }
  }
}
