export function extractErrorMessage(error: unknown, fallback = 'Something went wrong') {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { data?: string } } };
        return err.response?.data?.data || fallback;
    }
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return fallback;
}
