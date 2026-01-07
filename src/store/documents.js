import { create } from "zustand";
import api from "@/lib/api/api"; // same api used by apiClient.js :contentReference[oaicite:5]{index=5}

// IMPORTANT: keep endpoints consistent with your team's existing documentService.js :contentReference[oaicite:6]{index=6}
const CASE_BASE = "/cases";

const keyOf = (caseId, folder) => `${caseId}::${folder || "__root__"}`;

export const useDocumentsStore = create((set, get) => ({
    // ---------- UI state ----------
    activeCaseId: null,
    activeCaseId: null,
    activeFolder: "Evidence",
    selectedDocument: null, // Shared selected document state

    // ---------- cache ----------
    // cache[key] = { items: Document[], fetchedAt: number }
    cache: {},

    // ---------- request state ----------
    // loading[key] = boolean
    loading: {},
    // error[key] = any
    error: {},

    // ---------- selectors (helper getters) ----------
    getDocuments: (caseId, folder) => {
        const k = keyOf(caseId, folder);
        return get().cache[k]?.items ?? [];
    },

    isLoading: (caseId, folder) => {
        const k = keyOf(caseId, folder);
        return Boolean(get().loading[k]);
    },

    getError: (caseId, folder) => {
        const k = keyOf(caseId, folder);
        return get().error[k] ?? null;
    },

    // ---------- simple setters ----------
    setActiveCase: (caseId) => set({ activeCaseId: caseId }),
    setActiveFolder: (folder) => set({ activeFolder: folder }),
    setSelectedDocument: (doc) => set({ selectedDocument: doc }),

    // ---------- core actions ----------
    fetchDocuments: async ({ caseId, folder, force = false } = {}) => {
        if (!caseId) return [];

        const k = keyOf(caseId, folder);
        const existing = get().cache[k];

        // Don’t refetch if we already have cache unless force=true
        if (existing && !force) return existing.items;

        set((state) => ({
            loading: { ...state.loading, [k]: true },
            error: { ...state.error, [k]: null },
        }));

        try {
            // GET /cases/:caseId/documents?folder=...
            const params = {};
            if (folder) params.folder = folder;

            const res = await api.get(`${CASE_BASE}/${caseId}/documents`, { params });
            const data = res.data;

            // backend response format: { success: true, data: [...] }
            const items = Array.isArray(data?.data) ? data.data : [];

            set((state) => ({
                cache: { ...state.cache, [k]: { items, fetchedAt: Date.now() } },
                loading: { ...state.loading, [k]: false },
            }));

            return items;
        } catch (err) {
            set((state) => ({
                loading: { ...state.loading, [k]: false },
                error: { ...state.error, [k]: err },
            }));
            throw err;
        }
    },

    fetchDocumentContent: async (documentId) => {
        console.log("[DEBUG] fetchDocumentContent called with:", documentId);
        if (!documentId) return null;

        try {
            // Updated to use the new direct ID route if we just need content
            // However, the PDFViewer usually needs a blob or URL. 
            // The new getDocumentById returns the full document object which has cloudinaryUrl.
            // We can reuse that or keep this specific content fetcher. 
            // Let's keep this compatible but maybe use the new route if needed.
            const endpoint = `/documents/id/${documentId}`;
            const response = await api.get(endpoint);
            
            if (response.data && response.data.data) {
                return response.data.data.cloudinaryUrl;
            }
            return null;
        } catch (error) {
            console.error("[DEBUG] Failed to fetch document content:", error);
            throw error;
        }
    },

    fetchDocumentById: async (documentId) => {
        if (!documentId) throw new Error("fetchDocumentById: documentId is required");
        try {
            const res = await api.get(`/documents/id/${documentId}`);
            if (res.data && res.data.success) {
                return res.data.data;
            }
            return null;
        } catch (err) {
            console.error("Error fetching document by ID:", err);
            throw err;
        }
    },

    uploadDocument: async ({ caseId, folderName, file, extra = {} }) => {
        if (!caseId) throw new Error("uploadDocument: caseId is required");
        if (!file) throw new Error("uploadDocument: file is required");

        // POST /cases/:caseId/documents
        const formData = new FormData();
        formData.append("file", file);
        if (folderName) formData.append("folder", folderName); // Standardized to "folder"

        // allow adding extra fields if your backend expects them later
        Object.entries(extra).forEach(([k, v]) => {
            if (v !== undefined && v !== null) formData.append(k, v);
        });

        const res = await api.post(`${CASE_BASE}/${caseId}/documents`, formData);

        // After upload, refresh that folder cache (force)
        await get().fetchDocuments({ caseId, folder: folderName, force: true });

        return res.data;
    },

    deleteDocument: async ({ caseId, documentId, folder } = {}) => {
        if (!caseId) throw new Error("deleteDocument: caseId is required");
        if (!documentId) throw new Error("deleteDocument: documentId is required");

        // Optimistic update: remove from cache immediately
        const k = keyOf(caseId, folder);
        const prev = get().cache[k]?.items ?? null;

        if (prev) {
            set((state) => ({
                cache: {
                    ...state.cache,
                    [k]: { ...state.cache[k], items: prev.filter((d) => d?._id !== documentId && d?.id !== documentId) },
                },
            }));
        }

        try {
            // DELETE /cases/:caseId/:documentId
            const res = await api.delete(`${CASE_BASE}/${caseId}/${documentId}`);
            return res.data;
        } catch (err) {
            // rollback optimistic update if delete fails
            if (prev) {
                set((state) => ({
                    cache: { ...state.cache, [k]: { ...state.cache[k], items: prev } },
                }));
            }
            throw err;
        }
    },

    // ---------- cache management ----------
    invalidate: ({ caseId, folder } = {}) => {
        if (!caseId) return;
        const k = keyOf(caseId, folder);

        set((state) => {
            const next = { ...state.cache };
            delete next[k];
            return { cache: next };
        });
    },

    resetDocuments: () =>
        set({
            activeCaseId: null,
            activeFolder: "Evidence",
            cache: {},
            loading: {},
            error: {},
        }),
}));
