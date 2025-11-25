export interface ChatCreateRequest {
    start: string;
    end: string;
    target: string[];
    malware: 'enable' | 'disable';
    exploit: 'enable' | 'disable';
    audience: string;
    language: string;
}

export interface ChatMessageRequest {
    message: string;
    chatId?: string;
}

export interface ChatResponse {
    message: string;
    chatId: string;
}

export interface ChatHistoryResponse {
    chatId: string;
    history: Array<{
        id: string;
        role: 'user' | 'assistant' | 'system';
        content: string;
        createdAt: Date;
        chatId: string;
    }>;
}

