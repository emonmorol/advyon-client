import api from '@/lib/api/api';

const BASE = '/case-access';

export const shareCaseAccess = async (payload) => {
  const { data } = await api.post(`${BASE}/share`, payload);
  return data?.data || data;
};

export const getCaseSharedUsers = async (caseId) => {
  const { data } = await api.get(`${BASE}/${caseId}/users`);
  return data?.data || data;
};

export const revokeCaseAccess = async (caseId, userId) => {
  const { data } = await api.delete(`${BASE}/${caseId}/${userId}`);
  return data?.data || data;
};
