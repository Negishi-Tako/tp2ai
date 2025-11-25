const API_BASE_URL = '/api'

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  chatId: string;
}

export interface ChatCreateRequest {
  start: string;
  end: string;
  target: string[];
  malware: 'enable' | 'disable';
  exploit: 'enable' | 'disable';
  audience: string;
  language: string;
}

export interface ChatHistoryResponse {
  chatId: string;
  history: ChatMessage[];
}

// The response from the Claude API
export interface ClaudeMessage {
    id: string;
    type: string;
    role: 'user' | 'assistant';
    content: {
        type: string;
        text: string;
    }[];
    model: string;
    stop_reason: string;
    stop_sequence: null | string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

export interface ClaudeMessageResponse {
    message: string;
    chatId: string;
}

export interface Settings {
  id?: string;
  elasticsearchURL: string;
  BASICAuthUser: string;
  BASICAuthPasswd: string;
  APIServerURL: string;
  createdAt?: string;
  updatedAt?: string;
}


export class ApiService {
  static async getSettings(): Promise<Settings | null> {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }
    return await response.json();
  }

  static async createSettings(settings: Settings): Promise<{ message: string, settings: Settings }> {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async updateSettings(id: string, settings: Settings): Promise<{ message: string, settings: Settings }> {
    const response = await fetch(`${API_BASE_URL}/settings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async createChat(formData: ChatCreateRequest): Promise<{ chatId: string }> {
    const response = await fetch(`${API_BASE_URL}/chat/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async sendChat(message: string, chatId?: string): Promise<ClaudeMessageResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/`, { // Corrected endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, chatId })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  static async getChatHistory(chatId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  static async getChatStats(): Promise<{ totalSessions: number, totalMessages: number }> {
    const response = await fetch(`${API_BASE_URL}/chat/stats`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  static async clearChatHistory(chatId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }
}
