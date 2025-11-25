import { Hono } from 'hono';
import { ChatHandler } from '../handlers/chat/handler.js';

export function createChatRoutes(app: Hono) {
    // Chat history endpoints
    app.get('/chat/:chatId', async (c) => {
        const chatId = c.req.param('chatId');
        const history = await ChatHandler.getHistory(chatId);
        return c.json({ chatId, history });
    });

    app.get('/chat/stats', async (c) => {
        const stats = await ChatHandler.getStats();
        return c.json(stats);
    });

    app.post('/chat/', async (c) => {
        const result = await ChatHandler.handleMessage(c);
        // handleMsgCoT returns [response, chatId] as a tuple
        if (Array.isArray(result) && result.length === 2) {
            const [response, chatId] = result;
            return c.json({ message: response, chatId: chatId });
        } else {
            return c.json(result);
        }
    });

    app.post('/chat/create', async (c) => {
        const chatId = await ChatHandler.createChat(c);
        return c.json({ chatId });
    });

    app.delete('/chat/:chatId', async (c) => {
        const chatId = c.req.param('chatId');
        if (!chatId) {
            return c.json({ error: 'chatId is required' }, 400);
        }
        await ChatHandler.clearChat(chatId);
        return c.json({ message: 'Chat cleared' });
    });
}

