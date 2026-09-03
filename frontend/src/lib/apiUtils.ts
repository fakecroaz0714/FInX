/**
 * Utility for bulletproof API calls.
 * Enforces response.ok and content-type validation to prevent
 * SyntaxError: Failed to execute 'json' on 'Response': Unexpected token '<', "<!DOCTYPE "... is not valid JSON
 */

export interface ApiResponse<T> {
    ok: boolean;
    data: T | null;
    error: string | null;
    status: number;
}

export async function safeJsonFetch<T>(
    url: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const statusText = response.statusText || 'Error';
            console.warn(`[safeJsonFetch] HTTP ${response.status} (${statusText}) for ${url}`);
            return {
                ok: false,
                data: null,
                error: `HTTP error: ${response.status} ${statusText}`,
                status: response.status
            };
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            console.warn(`[safeJsonFetch] Non-JSON Content-Type received: ${contentType} for ${url}`);
            return {
                ok: false,
                data: null,
                error: `Expected JSON response but received ${contentType || 'non-JSON payload'}`,
                status: response.status
            };
        }

        const data = await response.json();
        return {
            ok: true,
            data: data as T,
            error: null,
            status: response.status
        };
    } catch (err: any) {
        console.error(`[safeJsonFetch] Network or parsing failure for ${url}:`, err);
        return {
            ok: false,
            data: null,
            error: err?.message || 'Network request failed',
            status: 0
        };
    }
}
