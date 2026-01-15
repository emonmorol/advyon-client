import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../lib/api/api";
import { useEffect, useCallback } from "react";

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

  // Sync user with backend (Idempotent)
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

    try {
      // Example: Send user data to your backend to sync/create user
      // Adjust the endpoint '/users/sync' to match your backend
      const response = await api.post('/auth/sync', userData);
      return response.data;
    } catch (error) {
      console.error("Failed to sync user:", error);
      throw error;
    }
  }, [user, userLoaded]);

  return {
    api,
    syncUser,
    user,
    isLoaded: authLoaded && userLoaded,
  };
};
