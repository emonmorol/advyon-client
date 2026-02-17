import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../lib/api/api";
import { useEffect, useCallback } from "react";

/**
 * WBS-1.3 — Retry config for sync resilience.
 * Jittered exponential backoff: 1s → 2s → 4s (+ random 0-500ms).
 */
const SYNC_MAX_RETRIES = 3;
const SYNC_BASE_DELAY_MS = 1000;

/**
 * Sleep helper with jitter for backoff.
 * @param {number} attempt - Zero-based retry attempt index
 */
const backoffDelay = (attempt) =>
  new Promise((resolve) => {
    const base = SYNC_BASE_DELAY_MS * Math.pow(2, attempt);
    const jitter = Math.random() * 500;
    setTimeout(resolve, base + jitter);
  });

export const useAuthApi = () => {
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  // Interceptor to add the token to requests
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        if (isSignedIn) {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken, isSignedIn]);

  /**
   * Sync user with backend (Idempotent — single attempt).
   * Prefer `syncUserWithRetry` in production paths.
   */
  const syncUser = useCallback(async () => {
    if (!userLoaded || !user) {
      console.warn("User not loaded or not signed in");
      return null;
    }

    const userData = {
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };

    const response = await api.post('/auth/sync', userData);
    return response.data;
  }, [user, userLoaded]);

  /**
   * WBS-1.3 — Resilient sync with jittered exponential backoff.
   * Retries up to SYNC_MAX_RETRIES times before returning a
   * structured error object so callers can show user-friendly
   * messages without crashing.
   *
   * @returns {{ data: object|null, error: string|null, retries: number }}
   */
  const syncUserWithRetry = useCallback(async () => {
    let lastError = null;

    for (let attempt = 0; attempt <= SYNC_MAX_RETRIES; attempt++) {
      try {
        const result = await syncUser();
        return { data: result, error: null, retries: attempt };
      } catch (err) {
        lastError = err;
        console.warn(
          `[useAuthApi] Sync attempt ${attempt + 1}/${SYNC_MAX_RETRIES + 1} failed`,
          err?.response?.status || err.message
        );

        if (attempt < SYNC_MAX_RETRIES) {
          await backoffDelay(attempt);
        }
      }
    }

    // All retries exhausted — return structured error (don't throw)
    const message =
      lastError?.response?.data?.message ||
      lastError?.message ||
      "Unable to synchronize your account. Please try again.";

    console.error("[useAuthApi] Sync failed after all retries:", message);
    return { data: null, error: message, retries: SYNC_MAX_RETRIES };
  }, [syncUser]);

  return {
    api,
    syncUser,
    syncUserWithRetry,
    user,
    isLoaded: authLoaded && userLoaded,
  };
};
