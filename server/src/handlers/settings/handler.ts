import { SettingsRepository } from '../../repositories/settings.js';
import type { Settings } from '../../types/settings.js';

export class SettingsHandler {
    /**
     * Get settings
     */
    static async getSettings() {
        return await SettingsRepository.getSettings();
    }

    /**
     * Create new settings
     */
    static async createSettings(data: Settings) {
        const existing = await SettingsRepository.settingsExist();
        if (existing) {
            throw new Error('Settings already exist. Use update.');
        }
        return await SettingsRepository.createSettings(data);
    }

    /**
     * Update settings
     */
    static async updateSettings(id: string, data: Settings) {
        return await SettingsRepository.updateSettings(id, data);
    }
}

