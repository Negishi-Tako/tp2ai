import { PrismaClient, ChatRole } from '@prisma/client';
import { USER_MESSAGE_MAX_LENGTH } from '../config/constants.js';

const prisma = new PrismaClient();

export class ChatRepository {
    /**
     * Create a new chat session
     */
    static async createSession() {
        return await prisma.chatSession.create({
            data: {}
        });
    }

    /**
     * Create a chat message
     */
    static async createMessage(role: ChatRole, content: string, chatId: string) {
        return await prisma.chatMessage.create({
            data: {
                role,
                content,
                chatId
            }
        });
    }

    /**
     * Get chat history
     */
    static async getHistory(chatId: string) {
        const history = await prisma.chatMessage.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }
        });

        // Truncate long user messages
        for (const msg of history) {
            if (msg.role === 'user' && msg.content.length > USER_MESSAGE_MAX_LENGTH) {
                msg.content = msg.content.slice(-USER_MESSAGE_MAX_LENGTH);
            }
        }

        return history;
    }

    /**
     * Clear chat history and session
     */
    static async clearChat(chatId: string) {
        await prisma.chatMessage.deleteMany({
            where: { chatId }
        });
        await prisma.chatSession.deleteMany({
            where: { id: chatId }
        });
        return true;
    }

    /**
     * Get chat statistics
     */
    static async getStats() {
        const [totalSessions, totalMessages] = await Promise.all([
            prisma.chatSession.count(),
            prisma.chatMessage.count()
        ]);

        return {
            totalSessions,
            totalMessages
        };
    }
}

