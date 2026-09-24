const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

const buildQuery = (params = {}) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || 'İstek tamamlanamadı.')
  }

  return data
}

export const api = {
  url: API_URL,
  get: (path, params) => request(`${path}${buildQuery(params)}`),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: async (ownerType, ownerNo, files) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))
    return request(`/api/documents/${ownerType}/${encodeURIComponent(ownerNo)}`, {
      method: 'POST',
      body: formData,
    })
  },
}

export const documentViewUrl = (id) => `${API_URL}/api/documents/${encodeURIComponent(id)}`
export const documentDownloadUrl = (id) => `${API_URL}/api/documents/${encodeURIComponent(id)}/download`

export const patientsApi = {
  list: () => api.get('/api/patients'),
  options: () => api.get('/api/patients/options'),
  detail: (id) => api.get(`/api/patients/${encodeURIComponent(id)}`),
  create: (body) => api.post('/api/patients', body),
  archive: (id) => api.patch(`/api/patients/${encodeURIComponent(id)}/archive`),
  restore: (id) => api.patch(`/api/patients/${encodeURIComponent(id)}/restore`),
  createExamination: (id, body) => api.post(`/api/patients/${encodeURIComponent(id)}/examinations`, body),
}

export const appointmentsApi = {
  list: (params) => api.get('/api/appointments', params),
  detail: (id) => api.get(`/api/appointments/${encodeURIComponent(id)}`),
  create: (body) => api.post('/api/appointments', body),
  update: (id, body) => api.put(`/api/appointments/${encodeURIComponent(id)}`, body),
  status: (id, status) => api.patch(`/api/appointments/${encodeURIComponent(id)}/status`, { status }),
}

export const examinationsApi = {
  list: (params) => api.get('/api/examinations', params),
  status: (id, body) => api.patch(`/api/examinations/${encodeURIComponent(id)}/status`, body),
  remove: (id) => api.delete(`/api/examinations/${encodeURIComponent(id)}`),
}

export const prescriptionsApi = {
  list: (params) => api.get('/api/prescriptions', params),
  detail: (id) => api.get(`/api/prescriptions/${encodeURIComponent(id)}`),
  update: (id, body) => api.put(`/api/prescriptions/${encodeURIComponent(id)}`, body),
  status: (id, body) => api.patch(`/api/prescriptions/${encodeURIComponent(id)}/status`, body),
  remove: (id) => api.delete(`/api/prescriptions/${encodeURIComponent(id)}`),
}

export const testsApi = {
  list: (params) => api.get('/api/tests', params),
  detail: (id) => api.get(`/api/tests/${encodeURIComponent(id)}`),
  create: (body) => api.post('/api/tests', body),
  update: (id, body) => api.patch(`/api/tests/${encodeURIComponent(id)}`, body),
}

export const staffApi = {
  list: () => api.get('/api/staff'),
  doctors: () => api.get('/api/staff/doctors'),
  detail: (id) => api.get(`/api/staff/${encodeURIComponent(id)}`),
  create: (body) => api.post('/api/staff', body),
  update: (id, body) => api.put(`/api/staff/${encodeURIComponent(id)}`, body),
  status: (id, status) => api.patch(`/api/staff/${encodeURIComponent(id)}/status`, { status }),
}

export const pricesApi = {
  list: (params) => api.get('/api/prices', params),
  detail: (id) => api.get(`/api/prices/${encodeURIComponent(id)}`),
  create: (body) => api.post('/api/prices', body),
  update: (id, body) => api.put(`/api/prices/${encodeURIComponent(id)}`, body),
  status: (id, status) => api.patch(`/api/prices/${encodeURIComponent(id)}/status`, { status }),
  remove: (id) => api.delete(`/api/prices/${encodeURIComponent(id)}`),
}

export const logsApi = {
  list: (params) => api.get('/api/logs', params),
  detail: (id) => api.get(`/api/logs/${encodeURIComponent(id)}`),
}

export const dashboardApi = {
  get: () => api.get('/api/dashboard'),
}

export const reportsApi = {
  get: (params) => api.get('/api/reports', params),
}

export const settingsApi = {
  get: () => api.get('/api/settings'),
  update: (body) => api.put('/api/settings', body),
}

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (body) => api.put('/api/profile', body),
}

export const supportApi = {
  list: () => api.get('/api/support'),
  create: (body) => api.post('/api/support', body),
}
