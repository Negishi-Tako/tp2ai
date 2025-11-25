import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
import { errorHandler } from './middleware/error.js';
import { createChatRoutes } from './routes/chat.js';
import { createSettingsRoutes } from './routes/settings.js';
import { SERVER_CONFIG } from './config/constants.js';

const app = new Hono();

// Error handling
app.onError(errorHandler);

// WebSocket endpoint
const { upgradeWebSocket } = createNodeWebSocket({ app });

app.get(
    '/ws',
    upgradeWebSocket((c) => ({
        onMessage(event, ws) {
            console.log(`Message from client: ${event.data}`);
            ws.send('Hello from server!');
        },
        onClose: () => {
            console.log('Connection closed');
        },
    }))
);

// Root endpoint
app.get('/', (c) => {
    return c.text('T-Pot AI Security Report API');
});

// Register routes
createChatRoutes(app);
createSettingsRoutes(app);

// Start server
serve(
    {
        fetch: app.fetch,
        port: SERVER_CONFIG.PORT
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);
