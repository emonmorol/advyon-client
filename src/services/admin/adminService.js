import { buildUrl, useApiSWR, useApiMutation } from '../_shared/apiClient';

// ─── User Management (existing) ─────────────────────────────────
const BASE = '/admin/users';

export const useAdminUsers = (params) => useApiSWR(buildUrl(BASE, params));
export const useAdminUser = (id) => useApiSWR(id ? `${BASE}/${id}` : null);
export const useUpdateUserRole = (id) =>
  useApiMutation(`${BASE}/${id}/role`, 'patch');
export const useUpdateUserStatus = (id) =>
  useApiMutation(`${BASE}/${id}/status`, 'patch');
export const useDeleteAdminUser = (id) =>
  useApiMutation(`${BASE}/${id}`, 'delete');

// ─── Bulk Operations ─────────────────────────────────────────────
export const useBulkUpdateUsers = () =>
  useApiMutation(`${BASE}/bulk`, 'post');

// ─── Case Oversight ──────────────────────────────────────────────
export const useCaseOverview = () =>
  useApiSWR('/admin/cases/overview');

// ─── System Settings ─────────────────────────────────────────────
export const useSystemSettings = () =>
  useApiSWR('/admin/settings');

export const useUpdateSystemSettings = () =>
  useApiMutation('/admin/settings', 'patch');

// ─── Analytics Overview ──────────────────────────────────────────
export const useAdminAnalytics = () =>
  useApiSWR('/admin/analytics');

// ─── Audit Logs ──────────────────────────────────────────────────
export const useAuditLogs = (params) =>
  useApiSWR(buildUrl('/admin/audit-logs', params));
