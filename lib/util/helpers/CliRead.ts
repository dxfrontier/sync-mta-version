import { Command } from 'commander';
import { CliFiles } from '../types';

export class CliRead {
  private readonly commander: Command;
  constructor() {
    this.commander = new Command();

    this.initialize();
  }

  private initialize() {
    this.commander
      .description('CLI tool to synchronize versions between package.json and MTA files.')
      .requiredOption(
        '-f, --file <mta>',
        'add the MTA file to be processed for version synchronization with the root package.json version',
        'mta.yaml',
      )
      .option(
        '-e, --extension [extensions...]',
        'add the MTA extension (mtaext) files to be processed for version synchronization with the root package.json version (multiple files allowed, separated by space).',
      )
      .option(
        '-u, --uiLocation <uiLocation>',
        'add the UI folder to update package.json (version) and manifest.json ("sap.app".applicationVersion.version) properties recursively from the root package.json version (usually is /app).',
      )
      .addHelpText(
        'after',
        // ! Do not change the formatting as it will look ugly in the terminal
        `
Example:
  $ sync-mta-version
  $ sync-mta-version -f mta.yaml
  $ sync-mta-version -f mta.yaml -e dev.mtaext qa.mtaext production.mtaext
  $ sync-mta-version -f mta.yaml -e dev.mtaext qa.mtaext production.mtaext -u /app
  $ sync-mta-version -f mta.yaml -u /app`,
      );

    this.commander.parse(process.argv);
  }

  public getFiles(): CliFiles {
    return this.commander.opts();
  }
}
