import { create } from 'zustand';
import api from '../lib/api/api';

const useLegalStore = create((set) => ({
    legals: [],
    meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPage: 1
    },
    isLoading: false,
    error: null,
    selectedLegal: null,

    fetchLegals: async (query = {}) => {
        set({ isLoading: true, error: null });
        try {
            const { search, actName, year, page = 1, limit = 10 } = query;
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (actName && actName !== 'all') params.append('actName', actName);
            if (year && year !== 'all') params.append('year', year);
            params.append('page', page);
            params.append('limit', limit);

            const response = await api.get(`/legal?${params.toString()}`);
            set({
                legals: response.data.data,
                meta: response.data.meta,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch legals',
                isLoading: false
            });
        }
    },

    fetchSingleLegal: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/legal/${id}`);
            set({
                selectedLegal: response.data.data,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch legal details',
                isLoading: false
            });
        }
    },

    fetchSectionByNumber: async (actName, number) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('actName', actName);
            params.append('number', number);

            const response = await api.get(`/legal?${params.toString()}`);
            if (response.data.data && response.data.data.length > 0) {
                // Assuming the combination of actName and number is unique
                return response.data.data[0];
            }
            return null;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch section',
                isLoading: false
            });
            return null;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useLegalStore;
