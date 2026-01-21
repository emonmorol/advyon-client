import { buildUrl, useApiMutation, useApiSWR } from '../_shared/apiClient';

const CASE_BASE = '/cases';
const DOCUMENT_BASE = '/documents';

export const useDocuments = (caseId, folder) =>
  useApiSWR(caseId ? buildUrl(`${CASE_BASE}/${caseId}/documents`, { folder }) : null);

export const useUploadDocument = (caseId) =>
  useApiMutation(`${CASE_BASE}/${caseId}/documents`, 'post');

export const useDeleteDocument = (caseId, documentId) =>
  useApiMutation(`${CASE_BASE}/${caseId}/documents/${documentId}`, 'delete');

/**
 * Get all documents for the current user across all cases
 * @param {Object} params - Optional query parameters { folder, processingStatus, category }
 */
export const useAllDocuments = (params = {}) =>
  useApiSWR(buildUrl(`${DOCUMENT_BASE}/my-documents`, params));

/**
 * Usage example:
 *
 * const { data: docs } = useDocuments(caseId, folder);
 * const { trigger: uploadDoc } = useUploadDocument(caseId);
 * const formData = new FormData();
 * formData.append('file', file);
 * formData.append('folderName', folder);
 * await uploadDoc(formData);
 * const { trigger: deleteDoc } = useDeleteDocument(caseId, docId);
 * 
 * // Get all user documents
 * const { data: allDocs } = useAllDocuments({ category: 'Evidence' });
 */

