/**
 * Extract JSON code blocks from message
 * @param msg - Message string
 * @returns Array of JSON code blocks
 */
export function extractJsonBlocks(msg: string): string[] {
    const regex = /```json([\s\S]*?)```/g;
    const matches = msg.match(regex);
    return matches || [];
}

/**
 * Check if message contains JSON code blocks
 * @param msg - Message string
 * @returns true if contains JSON blocks
 */
export function hasJsonBlocks(msg: string): boolean {
    return /```json([\s\S]*?)```/.test(msg);
}

/**
 * Normalize JSON code block markers
 * @param msg - Message string
 * @returns Normalized message
 */
export function normalizeJsonMarkers(msg: string): string {
    return msg.replace('```JSON', '```json');
}

