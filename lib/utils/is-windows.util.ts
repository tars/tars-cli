import { platform } from 'os';

/**
 * Check operation system name
 * @return {Boolean} Is OS Windows or not
 */
export const isWindows = () => {
    return (/^win/i).test(platform());
}
