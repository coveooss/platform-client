import * as chalk from 'chalk';
import * as _ from 'underscore';

export class Logger {

    // TODO: make this class in sync with inquier

    public static info(message: string, ...meta: any[]) {
        console.log(chalk.green.bold(message));
        _.each(meta, (m: any) => {
            console.log(chalk.green(m.toString()));
        })
    }

    public static error(message: string, ...meta: any[]) {
        console.log(chalk.red.bold(message));
        _.each(meta, (m: any) => {
            console.log(chalk.red(m.toString()));
        })
    }

    public static warn(message: string, ...meta: any[]) {
        console.log(chalk.yellow.bold(message));
        _.each(meta, (m: any) => {
            // console.log(chalk.yellow(m.toString()));
        })
    }

    // public static debug(message: string, ...meta: any[]) {
    //     if (process.env.NODE_ENV !== 'production') {
    //         ...
    //     }
    // }

};
