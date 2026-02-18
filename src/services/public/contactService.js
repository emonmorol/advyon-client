import api from '@/lib/api/api';

const unwrap = (response) => response?.data ?? response;

export const fetchContactMeta = async () => {
  const res = await api.get('/contact/meta');
  return unwrap(res.data);
};

export const submitContactRequest = async (payload) => {
  const res = await api.post('/contact', payload);
  return unwrap(res.data);
};
