import { PrismaClient } from '@prisma/client';
import { MASKED_PASSWORD } from '../config/constants.js';
import type { Settings } from '../types/settings.js';

const prisma = new PrismaClient();

export class SettingsRepository {
    /**
     * Get settings (first record)
     */
    static async getSettings() {
        const result = await prisma.env.findFirst();
        if (result?.BASICAuthPasswd) {
            result.BASICAuthPasswd = MASKED_PASSWORD;
        }
        return result;
    }

    /**
     * Check if settings exist
     */
    static async settingsExist(): Promise<boolean> {
        const existing = await prisma.env.findFirst();
        return !!existing;
    }

    /**
     * Create new settings
     */
    static async createSettings(data: Settings) {
        return await prisma.env.create({
            data: {
                elasticsearchURL: data.elasticsearchURL,
                BASICAuthUser: data.BASICAuthUser,
                BASICAuthPasswd: data.BASICAuthPasswd,
                APIServerURL: data.APIServerURL,
            }
        });
    }

    /**
     * Update settings
     */
    static async updateSettings(id: string, data: Settings) {
        return await prisma.env.update({
            where: { id },
            data: {
                elasticsearchURL: data.elasticsearchURL,
                BASICAuthUser: data.BASICAuthUser,
                BASICAuthPasswd: data.BASICAuthPasswd,
                APIServerURL: data.APIServerURL,
            },
        });
    }
}

