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
      .requiredOption('-f, --file <mta>', 'Add the MTA file to be processed.', 'mta.yaml')
      .option(
        '-e, --extension [extensions...]',
        'Add the MTA extension (mtaext) files to be processed (multiple files allowed, separated by space)',
      )
      .addHelpText(
        'after',
        `
Example:
  $ sync-mta-version
  $ sync-mta-version -f mta.yaml
  $ sync-mta-version -f mta.yaml -e dev.mtaext qa.mtaext production.mtaext`,
      );

    this.commander.parse(process.argv);
  }

  public getFiles(): CliFiles {
    return this.commander.opts();
  }
}
