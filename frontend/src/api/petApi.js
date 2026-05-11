const API_BASE = '/api';

export const petApi = {
  fetchPet: async () => {
    const response = await fetch(`${API_BASE}/pet`);
    if (!response.ok) throw new Error('Failed to fetch pet');
    return response.json();
  },

  tickPet: async () => {
    const response = await fetch(`${API_BASE}/pet/tick`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to tick pet');
    return response.json();
  },

  action: async (action) => {
    const response = await fetch(`${API_BASE}/pet/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Action failed');
    }
    return response.json();
  },

  reset: async () => {
    const response = await fetch(`${API_BASE}/pet/reset`);
    if (!response.ok) throw new Error('Failed to reset pet');
    return response.json();
  },
};
