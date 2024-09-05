import * as fs from 'fs';
import * as YAML from 'yaml';

import { VersionUpdater } from '../lib/core/VersionUpdater';
import { constants } from '../lib/constants/constants';

jest.mock('fs');

describe('VersionUpdater', () => {
  const mockPackageJson = { version: '1.2.3' };
  const mockMtaYaml = { version: '1.0.0' };

  beforeEach(() => {
    // Mock reading package.json to return the mock version
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.endsWith(constants.PACKAGE)) {
        return JSON.stringify(mockPackageJson);
      }

      if (filePath.endsWith('mta.yaml')) {
        return YAML.stringify(mockMtaYaml);
      }

      return '';
    });

    // Mock writeFileSync to capture the updated YAML content
    (fs.writeFileSync as jest.Mock).mockImplementation((filePath: string, data: string) => {
      if (filePath.endsWith('mta.yaml')) {
        mockMtaYaml.version = YAML.parse(data).version;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('It should update the mta.yaml version to match the package.json version', () => {
    // Arrange
    const updater = new VersionUpdater();

    // Act
    updater.syncVersion();

    // Assert
    expect(mockMtaYaml.version).toBe(mockPackageJson.version);
  });
});
