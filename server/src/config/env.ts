import 'dotenv/config';

export const env = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
    CLAUDE_API_FILE_1: process.env.CLAUDE_API_FILE_1 || '',
    CLAUDE_API_FILE_3: process.env.CLAUDE_API_FILE_3 || '',
    KIBANA_USERNAME: process.env.KIBANA_USERNAME || '',
    KIBANA_PASSWD: process.env.KIBANA_PASSWD || '',
    KIBANA_URL: process.env.KIBANA_URL || '',
    NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED || '0',
} as const;

// Ignore SSL certificate errors globally
if (env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

