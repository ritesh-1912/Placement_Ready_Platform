const STORAGE_KEY = 'placement_analysis_history'

export function saveAnalysis(analysisData) {
  const history = getHistory()
  const baseScore = typeof analysisData.readinessScore === 'number' ? analysisData.readinessScore : 0
  const newEntry = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    baseReadinessScore: baseScore,
    ...analysisData
  }
  history.unshift(newEntry) // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return newEntry
}

export function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading history:', error)
    return []
  }
}

export function getAnalysisById(id) {
  const history = getHistory()
  return history.find(entry => entry.id === id) || null
}

export function updateAnalysis(id, updates) {
  const history = getHistory()
  const index = history.findIndex(entry => entry.id === id)
  if (index === -1) return null
  history[index] = { ...history[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return history[index]
}

export function deleteAnalysis(id) {
  const history = getHistory()
  const filtered = history.filter(entry => entry.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
