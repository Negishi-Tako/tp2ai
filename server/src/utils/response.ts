import { MASKED_PASSWORD } from '../config/constants.js';
import type { Settings } from '../types/settings.js';

/**
 * Mask password in settings object
 * @param settings - Settings object
 * @returns Settings object with masked password
 */
export function maskPassword(settings: Settings): Settings {
    const masked = { ...settings };
    if (masked.BASICAuthPasswd) {
        masked.BASICAuthPasswd = MASKED_PASSWORD;
    }
    return masked;
}

