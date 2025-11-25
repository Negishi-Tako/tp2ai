/**
 * Format a date to ISO string format
 * @param date - Date object or string
 * @returns ISO string representation
 */
export function formatDate(date: Date | string): string {
    if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString();
        }
        return date; // fallback to original string
    }
    if (date instanceof Date) {
        return date.toISOString();
    }
    return String(date);
}

