import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api/api";

const BASE = "/cases";

export const useCasesStore = create(persist((set, get) => ({
    // ---------- State ----------
    cases: [],            // List of all cases
    activeCaseId: null,   // Currently selected case ID

    // Request states
    isLoading: false,
    error: null,
    lastFetched: null,    // Timestamp for caching strategy

    // ---------- Selectors ----------
    // Get the full active case object
    getActiveCase: () => {
        const { cases, activeCaseId } = get();
        return cases.find((c) => c.id === activeCaseId || c._id === activeCaseId) || null;
    },

    // Get a specific case by ID
    getCaseById: (id) => get().cases.find((c) => c.id === id || c._id === id),

    // ---------- Actions ----------

    // Set the Active Case (Global Switch)
    setActiveCaseId: (id) => set({ activeCaseId: id }),

    // Fetch all cases (Replaces usage of useCases hook)
    fetchCases: async (force = false) => {
        const { lastFetched, isLoading } = get();

        // Cache Strategy: Don't refetch if fetched < 1 minute ago, unless forced
        // Note: lastFetched is set to 0 after create/update/delete to invalidate cache
        if (!force && lastFetched && Date.now() - lastFetched < 60000) {
            return get().cases;
        }

        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
            const res = await api.get(BASE);
            const data = res.data;
            // Handle array or wrapped response
            const cases = Array.isArray(data) ? data : (data?.data || []);

            set({
                cases,
                isLoading: false,
                lastFetched: Date.now()
            });
            return cases;
        } catch (err) {
            set({ isLoading: false, error: err.message || "Failed to fetch cases" });
            console.error(err);
        }
    },

    // Create a new case
    createCase: async (caseData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post(BASE, caseData);
            const newCase = res.data; // Assuming backend returns the created object

            set((state) => ({
                cases: [newCase, ...state.cases], // Prepend to list
                isLoading: false,
                activeCaseId: newCase.id || newCase._id, // Optionally auto-select it
                lastFetched: 0 // Invalidate cache to force refetch on next fetchCases call
            }));
            return newCase;
        } catch (err) {
            set({ isLoading: false, error: err.message || "Failed to create case" });
            throw err;
        }
    },

    // Update a case (Optimistic Update)
    updateCase: async (id, updates) => {
        const prevCases = get().cases;

        // 1. Optimistic Update
        set((state) => ({
            cases: state.cases.map(c =>
                (c.id === id || c._id === id) ? { ...c, ...updates } : c
            )
        }));

        try {
            // 2. API Call
            await api.put(`${BASE}/${id}`, updates);
            // Invalidate cache to force refetch on next fetchCases call
            set({ lastFetched: 0 });
        } catch (err) {
            // 3. Rollback on error
            set({ cases: prevCases, error: "Failed to update case" });
            throw err;
        }
    },

    // Delete a case
    deleteCase: async (id) => {
        const prevCases = get().cases;

        set((state) => ({
            cases: state.cases.filter(c => c.id !== id && c._id !== id)
        }));

        try {
            await api.delete(`${BASE}/${id}`);
            // If active case was deleted, clear selection
            if (get().activeCaseId === id) {
                set({ activeCaseId: null });
            }
            // Invalidate cache to force refetch on next fetchCases call
            set({ lastFetched: 0 });
        } catch (err) {
            set({ cases: prevCases, error: "Failed to delete case" });
            throw err;
        }
    },

    // ---------- Documents Actions (Added) ----------
    documents: {}, // Map caseId -> list of documents

    fetchDocuments: async (caseId, folder = '') => {
        set({ isLoading: true, error: null });
        try {
            const url = folder ? `${BASE}/${caseId}/documents?folder=${folder}` : `${BASE}/${caseId}/documents`;
            const { data } = await api.get(url);
            set((state) => ({
                documents: {
                    ...state.documents,
                    [caseId]: Array.isArray(data) ? data : (data?.data || [])
                },
                isLoading: false
            }));
        } catch (err) {
            set({ isLoading: false, error: err.message || "Failed to fetch documents" });
            console.error(err);
        }
    }
}), {
    name: 'advyon-cases-storage',
    partialize: (state) => ({ cases: state.cases, activeCaseId: state.activeCaseId }), // Only persist data
}));
