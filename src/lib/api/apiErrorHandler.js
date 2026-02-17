/**
 * WBS-TD-CQ-01 — Shared API error envelope utility.
 * Normalises Axios errors into a consistent { code, message, details } shape
 * so every consumer gets the same error contract.
 */

/**
 * @typedef {Object} ApiError
 * @property {number} code - HTTP status code (or 0 for network errors)
 * @property {string} message - Human-friendly error message
 * @property {object|null} details - Server-provided field-level errors / extra context
 * @property {boolean} isNetworkError - True when the request never reached the server
 */

const STATUS_MESSAGES = {
    400: 'The request was invalid. Please check your input.',
    401: 'Session expired. Please sign in again.',
    403: "You don't have permission to do this.",
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. Please try again.',
    413: 'The file is too large.',
    422: 'Validation failed. Please correct the highlighted fields.',
    429: 'Too many requests. Please wait a moment.',
    500: 'Something went wrong on our end. Please try again later.',
    502: 'Server is temporarily unavailable.',
    503: 'Service is undergoing maintenance. Try again shortly.',
};

/**
 * Transform a raw Axios error into a normalised ApiError envelope.
 * @param {import('axios').AxiosError} error
 * @returns {ApiError}
 */
export const normaliseError = (error) => {
    // Network / timeout (server never responded)
    if (!error.response) {
        return {
            code: 0,
            message: error.message === 'Network Error'
                ? 'Unable to reach the server. Check your connection.'
                : error.message || 'Request failed',
            details: null,
            isNetworkError: true,
        };
    }

    const { status, data } = error.response;

    return {
        code: status,
        message: data?.message || STATUS_MESSAGES[status] || `Unexpected error (${status})`,
        details: data?.errorSources || data?.errors || null,
        isNetworkError: false,
    };
};

/**
 * Build a response-interceptor function for an Axios instance.
 * It rejects with a normalised error envelope instead of a raw AxiosError.
 * @param {import('axios').AxiosInstance} axiosInstance
 */
export const attachErrorInterceptor = (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const apiError = normaliseError(error);

            // Attach the original Axios error for debugging
            apiError._raw = error;

            return Promise.reject(apiError);
        },
    );
};

export default { normaliseError, attachErrorInterceptor };
