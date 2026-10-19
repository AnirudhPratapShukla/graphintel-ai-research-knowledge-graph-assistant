async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {'Content-Type':'application/json', ...(options.headers || {})},
    ...options
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }
  return response.json()
}

export const api = {
  health: () => request('/api/health'),
  graph: () => request('/api/graph'),
  seedDemo: () => request('/api/demo/seed', {method:'POST'}),
  research: (query) => request('/api/research', {
    method:'POST',
    body:JSON.stringify({query,limit:5})
  }),
  ask: (question) => request('/api/ask', {
    method:'POST',
    body:JSON.stringify({question,top_k:5})
  })
}
