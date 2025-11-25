import type { Context } from 'hono';
import { ChatRepository } from '../../repositories/chat.js';
import { ClaudeService } from '../../services/claude.js';
import type { ChatCreateRequest, ChatMessageRequest } from '../../types/chat.js';

export class ChatHandler {
    /**
     * Handle incoming chat message
     */
    static async handleMessage(c: Context) {
        const { chatId, message }: ChatMessageRequest = await c.req.json();
        
        if (!message) {
            return c.json({ error: 'message is required' }, 400);
        }

        if (!chatId) {
            return c.json({ error: 'chatId is required' }, 400);
        }

        const history = await ChatRepository.getHistory(chatId);
        const historyContent = history.map(item => item.content);
        
        await ChatRepository.createMessage('user', message, chatId);
        
        const [claudeResponse, thinking] = await ClaudeService.handleClaudeInit(
            message,
            historyContent
        );
        
        return this.handleCoT(claudeResponse, chatId, thinking);
    }

    /**
     * Initialize new chat session with form data
     */
    static async createChat(c: Context): Promise<string> {
        const formData: ChatCreateRequest = await c.req.json();
        const { start, end, target, malware, exploit, audience, language } = formData;
        
        const prompt = await ClaudeService.buildInitPrompt(
            new Date(start),
            new Date(end),
            target,
            malware,
            exploit,
            audience,
            language
        );
        
        const [response, thinking] = await ClaudeService.handleClaudeInit(prompt, []);
        
        const newSession = await ChatRepository.createSession();
        const [result, chatId] = await this.handleCoT(response, newSession.id, thinking);
        
        return chatId;
    }

    /**
     * Handle Chain of Thought processing
     */
    static async handleCoT(response: string, chatId: string, thinking: string): Promise<[string, string]> {
        if (thinking) {
            response = '```text:CoTProcess' + thinking + '\n' + '```' + '\n' + response;
        }
        
        await ChatRepository.createMessage('assistant', response, chatId);
        
        return [response, chatId];
    }

    /**
     * Get chat history
     */
    static async getHistory(chatId: string) {
        return await ChatRepository.getHistory(chatId);
    }

    /**
     * Clear chat
     */
    static async clearChat(chatId: string) {
        return await ChatRepository.clearChat(chatId);
    }

    /**
     * Get chat statistics
     */
    static async getStats() {
        return await ChatRepository.getStats();
    }
}

