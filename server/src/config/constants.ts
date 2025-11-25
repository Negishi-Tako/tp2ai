export const SERVER_CONFIG = {
    PORT: 3000,
    DEFAULT_MAX_TOKENS: 7000,
    DEFAULT_THINKING_BUDGET_TOKENS: 5000,
    USER_MESSAGE_MAX_LENGTH: 4000,
} as const;

export const CLAUDE_CONFIG = {
    MODEL: 'claude-sonnet-4-5-20250929',
    MAX_TOKENS: 7000,
    THINKING_BUDGET_TOKENS: 5000,
    BETA_FEATURES: ['files-api-2025-04-14'],
} as const;

export const MASKED_PASSWORD = '********';

// Export commonly used constants directly for convenience
export const USER_MESSAGE_MAX_LENGTH = SERVER_CONFIG.USER_MESSAGE_MAX_LENGTH;

