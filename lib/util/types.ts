export type Paths = {
  package: string;
  mta: string;
};

export type VersionProp = {
  version: string;
};

export type ManifestProp = {
  'sap.app': {
    applicationVersion: {
      version: string;
    };
  };
};

export type CliFiles = { file: string; extension?: string[]; uiLocation?: string };
