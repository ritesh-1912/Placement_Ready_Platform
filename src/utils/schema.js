// Schema normalization and validation utilities

const DEFAULT_SKILLS_OTHER = ['Communication', 'Problem solving', 'Basic coding', 'Projects']

export function normalizeExtractedSkills(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') {
    return {
      coreCS: [],
      languages: [],
      web: [],
      data: [],
      cloud: [],
      testing: [],
      other: []
    }
  }

  // Map old category names to new standardized names
  const mapping = {
    'Core CS': 'coreCS',
    'Languages': 'languages',
    'Web': 'web',
    'Data': 'data',
    'Cloud/DevOps': 'cloud',
    'Testing': 'testing',
    'General': 'other'
  }

  const normalized = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: []
  }

  // Convert old format to new format
  Object.keys(extractedSkills).forEach((category) => {
    const newKey = mapping[category] || 'other'
    const skills = extractedSkills[category]?.skills || []
    if (Array.isArray(skills)) {
      normalized[newKey] = [...normalized[newKey], ...skills]
    }
  })

  // If no skills detected, add default skills to "other"
  const hasAnySkills = Object.values(normalized).some(arr => arr.length > 0)
  if (!hasAnySkills) {
    normalized.other = [...DEFAULT_SKILLS_OTHER]
  }

  return normalized
}

export function normalizeRoundMapping(roundMapping) {
  if (!roundMapping || !Array.isArray(roundMapping)) {
    return []
  }

  return roundMapping.map((round) => ({
    roundTitle: round.roundTitle || round.round || '',
    focusAreas: Array.isArray(round.focusAreas)
      ? round.focusAreas
      : (round.description ? [round.description] : []),
    whyItMatters: round.whyItMatters || round.why || ''
  }))
}

export function normalizeCompanyIntel(companyIntel) {
  if (!companyIntel || typeof companyIntel !== 'object') {
    return null
  }
  const name = typeof companyIntel.companyName === 'string' ? companyIntel.companyName.trim() : ''
  if (!name) return null
  return {
    companyName: name,
    industry: typeof companyIntel.industry === 'string' ? companyIntel.industry : 'Technology Services',
    sizeCategory: companyIntel.sizeCategory || 'Startup',
    sizeRange: companyIntel.sizeRange || '<200',
    hiringFocus: companyIntel.hiringFocus && typeof companyIntel.hiringFocus === 'object'
      ? {
          title: companyIntel.hiringFocus.title || 'Typical Hiring Focus',
          points: Array.isArray(companyIntel.hiringFocus.points) ? companyIntel.hiringFocus.points : []
        }
      : { title: 'Typical Hiring Focus', points: [] }
  }
}

export function normalizeChecklist(checklist) {
  if (!checklist || typeof checklist !== 'object') {
    return []
  }

  return Object.entries(checklist).map(([roundTitle, items]) => ({
    roundTitle,
    items: Array.isArray(items) ? items : []
  }))
}

export function normalizePlan7Days(plan) {
  if (!plan || typeof plan !== 'object') {
    return []
  }

  return Object.entries(plan).map(([day, tasks]) => ({
    day,
    focus: day.split(':')[1]?.trim() || '',
    tasks: Array.isArray(tasks) ? tasks : []
  }))
}

export function normalizeQuestions(questions) {
  if (!questions || !Array.isArray(questions)) {
    return []
  }

  return questions.map((q) => {
    if (typeof q === 'string') return q
    return q.question || ''
  }).filter(q => q.length > 0)
}

export function normalizeAnalysisEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  try {
    const normalized = {
      id: entry.id || Date.now().toString(),
      createdAt: entry.createdAt || new Date().toISOString(),
      company: typeof entry.company === 'string' ? entry.company : '',
      role: typeof entry.role === 'string' ? entry.role : '',
      jdText: typeof entry.jdText === 'string' ? entry.jdText : '',
      extractedSkills: normalizeExtractedSkills(entry.extractedSkills),
      companyIntel: normalizeCompanyIntel(entry.companyIntel),
      roundMapping: normalizeRoundMapping(entry.roundMapping),
      checklist: normalizeChecklist(entry.checklist),
      plan7Days: normalizePlan7Days(entry.plan),
      questions: normalizeQuestions(entry.questions),
      baseScore: typeof entry.baseScore === 'number'
        ? entry.baseScore
        : (typeof entry.baseReadinessScore === 'number' ? entry.baseReadinessScore : (typeof entry.readinessScore === 'number' ? entry.readinessScore : 0)),
      skillConfidenceMap: entry.skillConfidenceMap && typeof entry.skillConfidenceMap === 'object'
        ? entry.skillConfidenceMap
        : {},
      finalScore: typeof entry.finalScore === 'number' ? entry.finalScore : (typeof entry.readinessScore === 'number' ? entry.readinessScore : 0),
      updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString()
    }

    // If no skills detected, ensure default skills are present
    const hasAnySkills = Object.values(normalized.extractedSkills).some(arr => arr.length > 0)
    if (!hasAnySkills) {
      normalized.extractedSkills.other = [...DEFAULT_SKILLS_OTHER]
    }

    return normalized
  } catch (error) {
    console.error('Error normalizing entry:', error)
    return null
  }
}

export function validateAnalysisEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return false
  }

  const requiredFields = ['id', 'createdAt', 'jdText']
  for (const field of requiredFields) {
    if (!entry[field]) {
      return false
    }
  }

  if (typeof entry.jdText !== 'string' || entry.jdText.trim().length === 0) {
    return false
  }

  return true
}
