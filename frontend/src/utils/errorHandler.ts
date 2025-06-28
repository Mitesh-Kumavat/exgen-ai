export function extractErrorMessage(error: unknown, fallback = 'Something went wrong. Try again later.') {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string, data?: string } } };
        return err.response?.data?.message || err.response?.data?.data || fallback;
    }
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return fallback;
}
