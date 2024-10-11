import fs from 'fs';
import path from 'path';
import { globSync } from 'tinyglobby';

import { util } from '../util';

import type { ManifestProp, VersionProp } from '../types';

export class SyncAppsVersion {
  constructor(private rootPackageJson: string) {}

  private isDirectory(filePath: string): boolean {
    return fs.statSync(filePath).isDirectory();
  }

  private isPackageJson(filePath: string): boolean {
    return path.basename(filePath) === 'package.json' && fs.statSync(filePath).isFile();
  }

  private isManifestJson(filePath: string): boolean {
    return path.basename(filePath) === 'manifest.json' && fs.statSync(filePath).isFile();
  }

  private syncFiles<T>(files: string[], updateVersion: (json: T) => void): boolean {
    let allUpdated = true;

    files.forEach((file) => {
      const jsonFile = util.readFile<T>(file);

      updateVersion(jsonFile);

      const isUpdated = util.writeFile(file, jsonFile);

      if (!isUpdated) {
        allUpdated = false;
      }
    });

    return allUpdated;
  }

  /**
   * Recursively finds all `package.json` and `manifest.json` files in the given directory.
   * @private
   */
  private findAllPackageAndManifestFiles(uiLocation: string): { packages: string[]; manifests: string[] } {
    const packages = globSync(`${uiLocation}/**/package.json`, { dot: true, deep: 3 });
    const manifests = globSync(`${uiLocation}/**/webapp/manifest.json`, { dot: true, deep: 3 });

    return { packages, manifests };
  }

  /**
   * Updates the version in all `package.json` files found in the specified app folder.
   * @public
   */
  public syncAppPackageAndManifestVersions(appFolderPath: string) {
    const { packages, manifests } = this.findAllPackageAndManifestFiles(appFolderPath);
    const mainPackageVersion = util.readFile<VersionProp>(this.rootPackageJson).version;

    const packagesUpdated = this.syncFiles<VersionProp>(packages, (json) => {
      json.version = mainPackageVersion;
    });

    const manifestsUpdated = this.syncFiles<ManifestProp>(manifests, (json) => {
      json['sap.app'].applicationVersion.version = mainPackageVersion;
    });

    return { packagesUpdated, manifestsUpdated };
  }
}
