import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions, DiffCommand } from '../commands/DiffCommand';
import { IBlacklistObjects } from '../coveoObjects/Organization';

export const DiffPipelinesCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('diff-pipelines <origin> <destination> <apiKey>')
    .description(['Diff the pipelines of 2 organizations'])
    .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
    // .option('-r, --rebuild', 'Rebuild the source once created. Default is false', false)
    .option(
      '-S, --ignorePipelines []',
      'List of pipelines to diff. String separated by ",". If no specified, all the pipelines will be diffed',
      commanderUtils.list,
      []
    )
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'diff-pipelines');

      // Set diff options
      const diffOptions: IDiffOptions = {
        silent: options.silent
      };

      const blacklistOptions: IBlacklistObjects = {
        pipelines: options.ignorePipelines
      };
      const command = new DiffCommand(origin, destination, apiKey, apiKey, blacklistOptions);
      diffOptions.keysToIgnore = ['id', 'description', 'position', 'last_modified_by', 'created_by'];
      const regexBase = '(id|position|description)';
      diffOptions.regexKeys = [`fieldModel.statements.\d.(${regexBase}|(condition.${regexBase})|(parent.${regexBase}))`];
      command.diffPipelines(diffOptions);
    });
};
