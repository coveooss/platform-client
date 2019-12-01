import * as program from 'commander';
import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { Organization } from '../coveoObjects/Organization';
import { ExtensionController } from '../controllers/ExtensionController';

program
  .command('diff-extensions <origin> <destination> <apiKey...>')
  .description('Diff the extensions of 2 organizations')
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option(
    '-o, --onlyKeys []',
    'Diff only the specified keys. String separated by ",". By default, the extension diff will only diff the following keys: "requiredDataStreams", "content", "description" and "name"',
    CommanderUtils.list
  )
  .option(
    '-E, --ignoreExtensions []',
    'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension.',
    CommanderUtils.list
  )
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((origin: string, destination: string, apiKey: string[], options: any) => {
    CommanderUtils.setLogger(options, 'diff-extensions');

    // Set diff options
    const diffOptions: IDiffOptions = {
      includeOnly: options.onlyKeys,
      silent: options.silent
    };

    const blacklistOptions = {
      extensions: _.union(['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'], options.ignoreExtensions)
    };
    diffOptions.includeOnly = diffOptions.includeOnly ? diffOptions.includeOnly : ['requiredDataStreams', 'content', 'description', 'name'];

    const originOrg = new Organization(origin, apiKey[0], blacklistOptions);
    const destinationOrg = new Organization(destination, apiKey[apiKey.length > 1 ? 1 : 0], blacklistOptions);
    const controller: ExtensionController = new ExtensionController(originOrg, destinationOrg);

    controller.diff(diffOptions);
  });
