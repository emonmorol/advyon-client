import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * WBS-TD-TS-01 — Unit tests for useAuthApi retry logic.
 *
 * Note: These tests mock the Clerk hooks and API module.
 * Run with: npx vitest run src/hooks/__tests__/useAuthApi.test.js
 */

// Mock Clerk hooks
vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => ({
        getToken: vi.fn().mockResolvedValue('mock-token'),
        isLoaded: true,
        isSignedIn: true,
    }),
    useUser: () => ({
        user: {
            id: 'clerk_123',
            primaryEmailAddress: { emailAddress: 'test@example.com' },
            firstName: 'Test',
            lastName: 'User',
            imageUrl: 'https://example.com/avatar.png',
        },
        isLoaded: true,
    }),
}));

// Mock API module
const mockPost = vi.fn();
vi.mock('@/lib/api/api', () => ({
    default: {
        post: (...args) => mockPost(...args),
        interceptors: {
            request: { use: vi.fn(), eject: vi.fn() },
            response: { use: vi.fn() },
        },
    },
}));

// Import after mocks
const { useAuthApi } = await import('../../useAuthApi');

describe('useAuthApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    describe('syncUser (single attempt)', () => {
        it('should call /auth/sync with user data', async () => {
            mockPost.mockResolvedValueOnce({ data: { success: true, data: { id: 'user_1' } } });

            const { result } = renderHook(() => useAuthApi());
            const response = await act(() => result.current.syncUser());

            expect(mockPost).toHaveBeenCalledWith('/auth/sync', {
                clerkId: 'clerk_123',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                imageUrl: 'https://example.com/avatar.png',
            });
            expect(response).toEqual({ success: true, data: { id: 'user_1' } });
        });

        it('should throw on API failure', async () => {
            mockPost.mockRejectedValueOnce(new Error('Network Error'));

            const { result } = renderHook(() => useAuthApi());
            await expect(act(() => result.current.syncUser())).rejects.toThrow('Network Error');
        });
    });

    describe('syncUserWithRetry', () => {
        it('should succeed on first attempt', async () => {
            mockPost.mockResolvedValueOnce({ data: { success: true } });

            const { result } = renderHook(() => useAuthApi());
            const response = await act(() => result.current.syncUserWithRetry());

            expect(response).toEqual({ data: { success: true }, error: null, retries: 0 });
            expect(mockPost).toHaveBeenCalledTimes(1);
        });

        it('should retry and succeed on second attempt', async () => {
            mockPost.mockRejectedValueOnce(new Error('timeout'));
            mockPost.mockResolvedValueOnce({ data: { success: true } });

            const { result } = renderHook(() => useAuthApi());
            const response = await act(() => result.current.syncUserWithRetry());

            expect(response).toEqual({ data: { success: true }, error: null, retries: 1 });
            expect(mockPost).toHaveBeenCalledTimes(2);
        });

        it('should return structured error after all retries exhausted', async () => {
            const error = new Error('Server down');
            mockPost.mockRejectedValue(error);

            const { result } = renderHook(() => useAuthApi());
            const response = await act(() => result.current.syncUserWithRetry());

            expect(response.data).toBeNull();
            expect(response.error).toBe('Server down');
            expect(response.retries).toBe(3);
            // 1 initial + 3 retries = 4 total calls
            expect(mockPost).toHaveBeenCalledTimes(4);
        });

        it('should prefer server error message over generic', async () => {
            const error = {
                response: { data: { message: 'Rate limited' }, status: 429 },
                message: 'Request failed',
            };
            mockPost.mockRejectedValue(error);

            const { result } = renderHook(() => useAuthApi());
            const response = await act(() => result.current.syncUserWithRetry());

            expect(response.error).toBe('Rate limited');
        });
    });
});
