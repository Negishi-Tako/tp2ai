import { Hono } from 'hono';
import { SettingsHandler } from '../handlers/settings/handler.js';
import { maskPassword } from '../utils/response.js';

export function createSettingsRoutes(app: Hono) {
    app.get('/settings', async (c) => {
        const result = await SettingsHandler.getSettings();
        return c.json(result);
    });

    app.post('/settings', async (c) => {
        const settings = await c.req.json();
        const result = await SettingsHandler.createSettings(settings);
        const maskedResult = maskPassword(result);
        return c.json({ message: 'Settings created', settings: maskedResult });
    });

    app.put('/settings/:id', async (c) => {
        const { id } = c.req.param();
        const settings = await c.req.json();
        const result = await SettingsHandler.updateSettings(id, settings);
        const maskedResult = maskPassword(result);
        return c.json({ message: 'Settings updated', settings: maskedResult });
    });
}

