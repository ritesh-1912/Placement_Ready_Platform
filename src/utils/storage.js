import { normalizeAnalysisEntry, validateAnalysisEntry } from './schema'

const STORAGE_KEY = 'placement_analysis_history'

export function saveAnalysis(analysisData) {
  const history = getHistory()
  const baseScore = typeof analysisData.readinessScore === 'number' ? analysisData.readinessScore : 0
  
  const newEntry = normalizeAnalysisEntry({
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    company: analysisData.company || '',
    role: analysisData.role || '',
    jdText: analysisData.jdText || '',
    extractedSkills: analysisData.extractedSkills,
    roundMapping: analysisData.roundMapping,
    checklist: analysisData.checklist,
    plan: analysisData.plan,
    questions: analysisData.questions,
    baseReadinessScore: baseScore,
    readinessScore: baseScore, // Initial finalScore equals baseScore
    skillConfidenceMap: {},
    updatedAt: new Date().toISOString()
  })

  if (!newEntry || !validateAnalysisEntry(newEntry)) {
    console.error('Failed to create valid analysis entry')
    return null
  }

  history.unshift(newEntry) // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return newEntry
}

export function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    // Normalize and validate all entries, filter out corrupted ones
    const validEntries = []
    let corruptedCount = 0

    for (const entry of parsed) {
      const normalized = normalizeAnalysisEntry(entry)
      if (normalized && validateAnalysisEntry(normalized)) {
        validEntries.push(normalized)
      } else {
        corruptedCount++
      }
    }

    if (corruptedCount > 0) {
      console.warn(`Skipped ${corruptedCount} corrupted history entry/entries`)
    }

    return validEntries
  } catch (error) {
    console.error('Error reading history:', error)
    return []
  }
}

export function getAnalysisById(id) {
  const history = getHistory()
  const entry = history.find(entry => entry.id === id)
  if (!entry) return null
  
  const normalized = normalizeAnalysisEntry(entry)
  return normalized && validateAnalysisEntry(normalized) ? normalized : null
}

export function updateAnalysis(id, updates) {
  const history = getHistory()
  const index = history.findIndex(entry => entry.id === id)
  if (index === -1) return null

  const existing = history[index]
  const updated = normalizeAnalysisEntry({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  })

  if (!updated || !validateAnalysisEntry(updated)) {
    console.error('Failed to update analysis entry')
    return null
  }

  // Ensure baseScore never changes, only finalScore updates
  if (typeof updates.readinessScore === 'number') {
    updated.finalScore = updates.readinessScore
    updated.readinessScore = updates.readinessScore // Keep for backward compatibility
  }

  history[index] = updated
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return updated
}

export function deleteAnalysis(id) {
  const history = getHistory()
  const filtered = history.filter(entry => entry.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
