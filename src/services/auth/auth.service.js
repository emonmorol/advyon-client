import api from '../../lib/api/api';

const BASE = '/auth';

export const authService = {
  /**
   * Complete user onboarding
   * @param {Object} payload - { role, profile: {...} }
   */
  onboardUser: async (payload) => {
    const response = await api.post(`${BASE}/onboard`, payload);
    return response.data;
  },

  /**
   * Sync user from Clerk (Idempotent)
   */
  syncUser: async () => {
    const response = await api.post(`${BASE}/sync`);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await api.get(`${BASE}/me`);
    return response.data;
  },
};
