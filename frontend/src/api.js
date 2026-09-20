// ─── API SERVICE ─────────────────────────────────────────────────────────────
const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login:    (body) => request('POST', '/auth/login', body),
  register: (body) => request('POST', '/auth/register', body),

  // Tables
  getTables: () => request('GET', '/tables'),

  // Reservations
  getAllReservations: () => request('GET', '/reservations'),
  getMyReservations:  () => request('GET', '/reservations/my'),
  createReservation:  (body) => request('POST', '/reservations', body),
  updateStatus: (id, status) => request('PATCH', `/reservations/${id}/status`, { status }),
};
