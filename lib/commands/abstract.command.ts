import { CommanderStatic } from 'commander';
import { AbstractAction } from '../actions/abstract.action';
import { isTarsInited, tarsNotInitedActions } from '../utils';

export abstract class AbstractCommand {
  constructor(protected action: AbstractAction) {}

  public abstract load(program: CommanderStatic): void;

  /**
   * Check TARS initialization and tars-config.js in current directory
   * @return {Boolean} TARS init status
   */
  public isTarsReadyToWork(): boolean {
    const { inited, error } = isTarsInited();

    // If we are not in TARS directory or TARS has not been inited
    if (!inited) {
      if (!error) {
        tarsNotInitedActions();
      }
      return false;
    }
    return true;
  }
}
