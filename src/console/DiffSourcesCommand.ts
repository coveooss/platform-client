import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions, DiffCommand } from '../commands/DiffCommand';
import { IBlacklistObjects } from '../coveoObjects/Organization';

export const DiffSourcesCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('diff-sources <origin> <destination> <apiKey>')
    .description(['Diff the sources of 2 organizations'])
    .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
    // .option('-r, --rebuild', 'Rebuild the source once created. Default is false', false)
    .option(
      '-S, --ignoreSources []',
      'List of sources to diff. String separated by ",". If no specified, all the sources will be diffed',
      commanderUtils.list,
      []
    )
    // Maybe we can use one of these options
    // .option('-M, --skipMappings', 'Keys to ignore. String separated by ",".', false)
    // .option('-E, --skipExtensions', 'Keys to ignore. String separated by ",".', false)

    // Not sure ignore keys are relavant here
    .option(
      '-E, --ignoreExtensions []',
      'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension',
      commanderUtils.list
    )
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'diff-sources');

      // Set diff options
      const diffOptions: IDiffOptions = {
        silent: options.silent
      };

      const blacklistOptions: IBlacklistObjects = {
        extensions: _.union(['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'], options.ignoreExtensions),
        sources: options.ignoreSources
      };
      const command = new DiffCommand(origin, destination, apiKey, apiKey, blacklistOptions);
      diffOptions.keysToIgnore = ['information', 'resourceId', 'id', 'owner', 'securityProviderReferences'];
      command.diffSources(diffOptions);
    });
};
