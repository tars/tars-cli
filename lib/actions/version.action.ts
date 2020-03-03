import { AbstractAction } from './abstract.action';
import chalk from 'chalk';
import { tarsSay } from '../utils';
const Download = require('download');
const semver = require('semver');

/**
 * Get version of tars-cli
 */
export class VersionAction extends AbstractAction {
  public async handle() {
    console.log('\n');
    const installedTarsCliVersion = require(`${process.env.cliRoot}/package.json`)
      .version;
    tarsSay(
      `TARS-CLI version: "${chalk.cyan.bold(installedTarsCliVersion)}"`,
      true,
    );

    Promise.resolve()
      .then(
        () =>
          new Promise(resolve => {
            new Download({ extract: true, mode: '755' })
              .get(
                'https://raw.githubusercontent.com/tars/tars-cli/master/package.json',
              )
              .run((error: any, files: any) => {
                if (error) {
                  return resolve();
                }

                const latestTarsCliVersion = JSON.parse(
                  files[0].contents.toString(),
                ).version;

                if (
                  semver.cmp(installedTarsCliVersion, '<', latestTarsCliVersion)
                ) {
                  tarsSay(
                    `Update available for TARS-CLI! New version is: "${chalk.cyan.bold(
                      latestTarsCliVersion,
                    )}"`,
                    true,
                  );
                  tarsSay(
                    `Run the command "${chalk.cyan.bold(
                      'tars update',
                    )}" to update TARS-CLI. \n`,
                    true,
                  );
                }
                return resolve();
              });
          }),
      )
      .then(() => {
        // @ts-ignore
        let installedTarsVersion;

        try {
          installedTarsVersion = require(`${process.cwd()}/tars.json`).version;
          tarsSay(
            `TARS version in current project: "${chalk.cyan.bold(
              installedTarsVersion,
            )}"`,
            true,
          );
        } catch (error) {
          /* eslint-disable no-undefined */
          installedTarsVersion = undefined;
          /* eslint-enable no-undefined */
        }

        new Download({ extract: true, mode: '755' })
          .get(
            'https://raw.githubusercontent.com/tars/tars/master/package.json',
          )
          .run((error: any, files: any) => {
            // @ts-ignore
            if (error || !installedTarsVersion) {
              return false;
            }

            const latestTarsVersion = JSON.parse(files[0].contents.toString())
              .version;

            // @ts-ignore
            if (semver.cmp(installedTarsVersion, '<', latestTarsVersion)) {
              tarsSay(
                `Update available for TARS! New version is: "${chalk.cyan.bold(
                  latestTarsVersion,
                )}"`,
                true,
              );
              tarsSay(
                `Run the command "${chalk.cyan.bold(
                  'tars update-project',
                )}" to update TARS in current project. \n`,
                true,
              );
            }
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
}
