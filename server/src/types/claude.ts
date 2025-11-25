export interface ClaudeRequest {
    msg: string;
    contextMsg?: string[];
    initial?: boolean;
    claude_prompt?: string;
}

export interface ClaudeResponse {
    response: string;
    thinking: string;
}

export interface ClaudeConfig {
    model: string;
    maxTokens: number;
    thinkingBudgetTokens: number;
    fileIds?: string[];
}

