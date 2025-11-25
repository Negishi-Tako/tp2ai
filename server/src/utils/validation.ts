/**
 * Validate URL format
 * @param url - URL string to validate
 * @returns true if valid, false otherwise
 */
export function validateURL(url: string): boolean {
    const urlPattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;
    const result = urlPattern.test(url);
    if (!result) {
        console.error('Invalid URL:', url);
    }
    return result;
}

/**
 * Format target array to string
 * @param target - Target string or array
 * @returns Formatted target string
 */
export function formatTarget(target: string | string[]): string {
    if (Array.isArray(target)) {
        return target.join(', ');
    }
    if (typeof target === 'string') {
        return target.length > 0 ? target : "(no targets specified)";
    }
    return String(target);
}

