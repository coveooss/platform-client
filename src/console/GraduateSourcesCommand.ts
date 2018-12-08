import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';

export const GraduateSourcesCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('graduate-sources <origin> <destination> <apiKey>')
    .description(['BETA Feature!! - Diff the sources of 2 Organizations.'])
    .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
    // .option('-r, --rebuild', 'Rebuild the source once created. Default is false', false)
    // TODO: sources options not implemented yet
    // .option('-S, --sources []', 'List of sources to diff. String separated by ",". If no specified, all the sources will be diffed', list)
    // Maybe we can use one of these options
    // .option('-M, --skipMappings', 'Keys to ignore. String separated by ",".', false)
    // .option('-E, --skipExtensions', 'Keys to ignore. String separated by ",".', false)

    // Not sure ignore keys are relavant here
    // .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', list)
    // TODO: provide option to rebuild
    // .option('-r, --rebuild', 'Rebuild source after graduation')
    .option(
      '-e, --ignoreExtensions []',
      'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension',
      commanderUtils.list
    )
    .option(
      '-m, --methods []',
      'HTTP method authorized by the Graduation. Should be a comma separated list (no spaces). Default value is "POST,PUT,DELETE".',
      commanderUtils.list,
      ['POST', 'PUT']
    )
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info (default), error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'graduate-sources');

      const graduateOptions: IGraduateOptions = {
        diffOptions: {
          sources: options.sources,
          silent: options.silent,
          keysToIgnore: ['information', 'resourceId', 'id', 'owner', 'securityProviderReferences']
        },
        keysToStrip: ['information', 'resourceId', 'id', 'owner', 'securityProviderReferences'], // These parameters will be stripped from the source before their graduation
        rebuild: options.rebuild,
        force: options.force,
        POST: options.methods.indexOf('POST') > -1,
        PUT: options.methods.indexOf('PUT') > -1,
        DELETE: options.methods.indexOf('DELETE') > -1
      };

      const blacklistOptions = {
        extensions: _.union(['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'], options.ignoreExtensions)
      };
      const command = new GraduateCommand(origin, destination, apiKey, apiKey, blacklistOptions);
      // if (options.skipExtensions) {
      //   _.extend(options.keysToIgnore, [], ['preConversionExtensions', 'postConversionExtensions']);
      // }
      command.graduateSources(graduateOptions);
    });
};
