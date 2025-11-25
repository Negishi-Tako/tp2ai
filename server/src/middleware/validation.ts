import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ChatCreateRequest, ChatMessageRequest } from '../types/chat.js';
import type { Settings } from '../types/settings.js';

/**
 * Validate chat create request
 */
export function validateChatCreate(data: any): data is ChatCreateRequest {
    return (
        typeof data === 'object' &&
        typeof data.start === 'string' &&
        typeof data.end === 'string' &&
        Array.isArray(data.target) &&
        (data.malware === 'enable' || data.malware === 'disable') &&
        (data.exploit === 'enable' || data.exploit === 'disable') &&
        typeof data.audience === 'string' &&
        typeof data.language === 'string'
    );
}

/**
 * Validate chat message request
 */
export function validateChatMessage(data: any): data is ChatMessageRequest {
    return (
        typeof data === 'object' &&
        typeof data.message === 'string' &&
        data.message.length > 0 &&
        (data.chatId === undefined || typeof data.chatId === 'string')
    );
}

/**
 * Validate settings
 */
export function validateSettings(data: any): data is Settings {
    return (
        typeof data === 'object' &&
        typeof data.elasticsearchURL === 'string' &&
        typeof data.BASICAuthUser === 'string' &&
        typeof data.BASICAuthPasswd === 'string' &&
        typeof data.APIServerURL === 'string'
    );
}

/**
 * Middleware to validate chat create request
 */
export async function validateChatCreateMiddleware(c: Context, next: () => Promise<void>) {
    const data = await c.req.json();
    if (!validateChatCreate(data)) {
        throw new HTTPException(400, { message: 'Invalid chat create request' });
    }
    c.set('validatedData', data);
    await next();
}

/**
 * Middleware to validate chat message request
 */
export async function validateChatMessageMiddleware(c: Context, next: () => Promise<void>) {
    const data = await c.req.json();
    if (!validateChatMessage(data)) {
        throw new HTTPException(400, { message: 'Invalid chat message request' });
    }
    c.set('validatedData', data);
    await next();
}

/**
 * Middleware to validate settings
 */
export async function validateSettingsMiddleware(c: Context, next: () => Promise<void>) {
    const data = await c.req.json();
    if (!validateSettings(data)) {
        throw new HTTPException(400, { message: 'Invalid settings data' });
    }
    c.set('validatedData', data);
    await next();
}

