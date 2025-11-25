import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Error handler middleware
 */
export async function errorHandler(err: Error, c: Context) {
    console.error('Error:', err);
    
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    
    return c.json(
        {
            error: 'Internal Server Error',
            message: err.message || 'An unexpected error occurred'
        },
        500
    );
}

