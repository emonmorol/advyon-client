import { buildUrl, useApiMutation, useApiSWR } from '../_shared/apiClient';

const BASE = '/users';

export const useUsers = (params) => useApiSWR(buildUrl(BASE, params));

export const useUser = (id) => useApiSWR(id ? `${BASE}/${id}` : null);
export const useMyClients = () => useApiSWR(`${BASE}/my-clients`);
export const useLawyers = (params) => useApiSWR(buildUrl(`${BASE}/lawyers`, params));

export const useCreateUser = () =>
  useApiMutation(`${BASE}/create-user`, 'post');

export const useUpdateUser = (id) => useApiMutation(`${BASE}/${id}`, 'patch');

export const useDeleteUser = (id) => useApiMutation(`${BASE}/${id}`, 'delete');

/**
 * Usage example:
 *
 * const { data: users } = useUsers({ page, limit, role });
 * const { data: user } = useUser(userId);
 * const { trigger: createUser } = useCreateUser();
 * const { trigger: updateUser } = useUpdateUser(userId);
 * const { trigger: deleteUser } = useDeleteUser(userId);
 */

export const useSubmitVerification = () =>
  useApiMutation(`${BASE}/lawyer/verify-request`, 'post');

