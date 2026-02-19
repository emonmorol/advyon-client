import { buildUrl, useApiMutation, useApiSWR } from '../_shared/apiClient';

const BASE = '/cases';

export const useCases = (params) => useApiSWR(buildUrl(BASE, params));

export const useCase = (caseId) =>
  useApiSWR(caseId ? `${BASE}/${caseId}` : null);

export const useCreateCase = () => useApiMutation(BASE, 'post');

export const useUpdateCase = (caseId) =>
  useApiMutation(`${BASE}/${caseId}`, 'put');

export const useDeleteCase = (caseId) =>
  useApiMutation(`${BASE}/${caseId}`, 'delete');

// WBS-4.2 Archive functions
export const useArchiveCase = () => useApiMutation(`${BASE}`, 'patch');

export const archiveCase = async (caseId) => {
  const response = await fetch(`${BASE}/${caseId}/archive`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to archive case');
  }
  return response.json();
};

export const restoreCase = async (caseId) => {
  const response = await fetch(`${BASE}/${caseId}/restore`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to restore case');
  }
  return response.json();
};

export const getArchivedCases = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE}/archived?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch archived cases');
  }
  return response.json();
};

/**
 * Usage example:
 *
 * const { data: cases } = useCases({ search, status, page, limit });
 * const { data: oneCase } = useCase(caseId);
 * const { trigger: createCase } = useCreateCase();
 * const { trigger: updateCase } = useUpdateCase(caseId);
 * const { trigger: deleteCase } = useDeleteCase(caseId);
 *
 * // Archive operations
 * await archiveCase(caseId);
 * await restoreCase(caseId);
 * const { data: archived } = await getArchivedCases();
 */
