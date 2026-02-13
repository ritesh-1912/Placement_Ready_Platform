import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getAnalysisById, getHistory, updateAnalysis } from '../utils/storage'
import OverallReadiness from '../components/dashboard/OverallReadiness'
import { CheckCircle2, Calendar, HelpCircle, Tag, Copy, Download, Target, Building2, Users, Briefcase, Info } from 'lucide-react'

const DEFAULT_CONFIDENCE = 'practice'

function getBaseScore(analysis) {
  // baseScore is never changed after initial analysis
  const base = analysis.baseScore ?? analysis.baseReadinessScore ?? analysis.readinessScore
  return typeof base === 'number' ? base : 0
}

function getAllSkills(extractedSkills) {
  const list = []
  if (!extractedSkills) return list

  // Handle both old format (categories with skills arrays) and new format (flat object)
  if (extractedSkills.coreCS || extractedSkills.languages || extractedSkills.web) {
    // New standardized format
    const categoryMap = {
      coreCS: 'Core CS',
      languages: 'Languages',
      web: 'Web',
      data: 'Data',
      cloud: 'Cloud/DevOps',
      testing: 'Testing',
      other: 'Other'
    }
    Object.keys(extractedSkills).forEach((key) => {
      const skills = Array.isArray(extractedSkills[key]) ? extractedSkills[key] : []
      const category = categoryMap[key] || key
      skills.forEach((skill) => list.push({ skill, category }))
    })
  } else {
    // Old format (nested categories)
    Object.keys(extractedSkills).forEach((category) => {
      const categoryData = extractedSkills[category]
      const skills = categoryData?.skills || (Array.isArray(categoryData) ? categoryData : [])
      skills.forEach((skill) => list.push({ skill, category }))
    })
  }
  return list
}

function computeLiveScore(baseScore, skillConfidenceMap, allSkills) {
  if (!allSkills.length) return baseScore
  let knowCount = 0
  let practiceCount = 0
  allSkills.forEach(({ skill }) => {
    const conf = skillConfidenceMap[skill] ?? DEFAULT_CONFIDENCE
    if (conf === 'know') knowCount++
    else practiceCount++
  })
  const score = baseScore + 2 * knowCount - 2 * practiceCount
  return Math.max(0, Math.min(100, score))
}

function formatPlanAsText(plan) {
  if (!plan) return ''
  
  // Handle both old format (object) and new format (array)
  if (Array.isArray(plan)) {
    return plan.map((p) => `${p.day}\n${(p.tasks || []).map((t) => `  • ${t}`).join('\n')}`).join('\n\n')
  }
  
  return Object.entries(plan)
    .map(([day, tasks]) => `${day}\n${(tasks || []).map((t) => `  • ${t}`).join('\n')}`)
    .join('\n\n')
}

function formatChecklistAsText(checklist) {
  if (!checklist) return ''
  
  // Handle both old format (object) and new format (array)
  if (Array.isArray(checklist)) {
    return checklist.map((c) => `${c.roundTitle}\n${(c.items || []).map((i) => `  ☐ ${i}`).join('\n')}`).join('\n\n')
  }
  
  return Object.entries(checklist)
    .map(([round, items]) => `${round}\n${(items || []).map((i) => `  ☐ ${i}`).join('\n')}`)
    .join('\n\n')
}

function formatQuestionsAsText(questions) {
  if (!questions) return ''
  return (questions || [])
    .map((q, i) => `${i + 1}. ${q.question} (${q.category || 'General'})`)
    .join('\n\n')
}

function fullReportAsText(analysis) {
  const parts = []
  if (analysis.company || analysis.role) {
    parts.push(`${analysis.company || ''} ${analysis.role || ''}`.trim())
    parts.push('')
  }
  parts.push('--- Key Skills Extracted ---')
  if (analysis.extractedSkills) {
    Object.entries(analysis.extractedSkills).forEach(([cat, data]) => {
      const skills = data?.skills || []
      if (skills.length) parts.push(`${cat}: ${skills.join(', ')}`)
    })
  }
  parts.push('')
  parts.push('--- Round-wise Checklist ---')
  parts.push(formatChecklistAsText(analysis.checklist))
  parts.push('')
  parts.push('--- 7-Day Plan ---')
  parts.push(formatPlanAsText(analysis.plan))
  parts.push('')
  parts.push('--- 10 Likely Interview Questions ---')
  parts.push(formatQuestionsAsText(analysis.questions))
  return parts.join('\n')
}

function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [skillConfidenceMap, setSkillConfidenceMapState] = useState({})
  const [copyFeedback, setCopyFeedback] = useState(null)

  const id = searchParams.get('id')

  const loadAnalysis = useCallback(() => {
    const history = getHistory()
    let entry = null
    if (id) {
      entry = getAnalysisById(id)
    }
    if (!entry && history.length > 0) {
      entry = history[0]
    }
    if (entry) {
      setAnalysis(entry)
      setSkillConfidenceMapState(entry.skillConfidenceMap || {})
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadAnalysis()
  }, [loadAnalysis])

  const setSkillConfidence = useCallback(
    (skill, value) => {
      const next = { ...skillConfidenceMap, [skill]: value }
      setSkillConfidenceMapState(next)
      if (analysis?.id) {
        const baseScore = getBaseScore(analysis)
        const allSkills = getAllSkills(analysis.extractedSkills)
        const liveScore = computeLiveScore(baseScore, next, allSkills)
        // Update finalScore, not baseScore (baseScore never changes)
        updateAnalysis(analysis.id, { 
          skillConfidenceMap: next, 
          finalScore: liveScore,
          readinessScore: liveScore // Keep for backward compatibility
        })
        setAnalysis((prev) => (prev ? { 
          ...prev, 
          skillConfidenceMap: next, 
          finalScore: liveScore,
          readinessScore: liveScore 
        } : null))
      }
    },
    [analysis, skillConfidenceMap]
  )

  const allSkills = analysis ? getAllSkills(analysis.extractedSkills) : []
  const baseScore = analysis ? getBaseScore(analysis) : 0
  const liveScore = analysis ? computeLiveScore(baseScore, skillConfidenceMap, allSkills) : 0
  // Use finalScore if available and skillConfidenceMap exists, otherwise compute from base
  const displayScore = analysis?.skillConfidenceMap && Object.keys(analysis.skillConfidenceMap).length > 0
    ? (analysis.finalScore ?? liveScore)
    : (analysis ? (analysis.finalScore ?? computeLiveScore(baseScore, {}, allSkills)) : 0)

  const weakSkills = allSkills
    .filter(({ skill }) => (skillConfidenceMap[skill] ?? DEFAULT_CONFIDENCE) === 'practice')
    .map(({ skill }) => skill)
    .slice(0, 3)

  const showCopyFeedback = (key) => {
    setCopyFeedback(key)
    setTimeout(() => setCopyFeedback(null), 2000)
  }

  const handleCopy = (text, key) => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => showCopyFeedback(key))
  }

  const handleDownloadTxt = () => {
    if (!analysis) return
    const text = fullReportAsText(analysis)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `placement-prep-${analysis.company || 'analysis'}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No analysis found.</p>
        <button
          onClick={() => navigate('/analyze')}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg"
        >
          Analyze a Job Description
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
          {analysis.company && (
            <p className="text-gray-600 mt-1">
              {analysis.company} {analysis.role && `• ${analysis.role}`}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/analyze')}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg"
        >
          New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <OverallReadiness score={displayScore} max={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Key Skills Extracted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                // Handle both old and new schema formats
                const skillsByCategory = {}
                if (analysis.extractedSkills.coreCS || analysis.extractedSkills.languages) {
                  // New format
                  const categoryMap = {
                    coreCS: 'Core CS',
                    languages: 'Languages',
                    web: 'Web',
                    data: 'Data',
                    cloud: 'Cloud/DevOps',
                    testing: 'Testing',
                    other: 'Other'
                  }
                  Object.keys(analysis.extractedSkills).forEach((key) => {
                    const skills = Array.isArray(analysis.extractedSkills[key]) ? analysis.extractedSkills[key] : []
                    if (skills.length > 0) {
                      skillsByCategory[categoryMap[key] || key] = skills
                    }
                  })
                } else {
                  // Old format
                  Object.keys(analysis.extractedSkills || {}).forEach((category) => {
                    const categoryData = analysis.extractedSkills[category]
                    const skills = categoryData?.skills || (Array.isArray(categoryData) ? categoryData : [])
                    if (skills.length > 0) {
                      skillsByCategory[category] = skills
                    }
                  })
                }
                return Object.entries(skillsByCategory)
              })().map(([category, skills]) => {
                if (skills.length === 0) return null
                return (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => {
                        const confidence = skillConfidenceMap[skill] ?? DEFAULT_CONFIDENCE
                        return (
                          <div
                            key={`${category}-${idx}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-gray-50"
                          >
                            <span className={confidence === 'know' ? 'text-primary' : 'text-gray-700'}>
                              {skill}
                            </span>
                            <div className="flex rounded-md overflow-hidden border border-gray-200">
                              <button
                                type="button"
                                onClick={() => setSkillConfidence(skill, 'know')}
                                className={`px-2 py-0.5 text-xs ${confidence === 'know' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                title="I know this"
                              >
                                Know
                              </button>
                              <button
                                type="button"
                                onClick={() => setSkillConfidence(skill, 'practice')}
                                className={`px-2 py-0.5 text-xs ${confidence === 'practice' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                title="Need practice"
                              >
                                Practice
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export tools */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCopy(formatPlanAsText(analysis.plan), 'plan')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="w-4 h-4" />
              Copy 7-day plan
            </button>
            <button
              type="button"
              onClick={() => handleCopy(formatChecklistAsText(analysis.checklist), 'checklist')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="w-4 h-4" />
              Copy round checklist
            </button>
            <button
              type="button"
              onClick={() => handleCopy(formatQuestionsAsText(analysis.questions), 'questions')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="w-4 h-4" />
              Copy 10 questions
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Download as TXT
            </button>
          </div>
          {copyFeedback && (
            <p className="text-sm text-primary mt-2">Copied to clipboard.</p>
          )}
        </CardContent>
      </Card>

      {/* Company Intel */}
      {analysis.companyIntel && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Intel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {analysis.companyIntel.companyName}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{analysis.companyIntel.industry}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{analysis.companyIntel.sizeCategory} ({analysis.companyIntel.sizeRange} employees)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {analysis.companyIntel.hiringFocus.title}
                </h4>
                <ul className="space-y-2">
                  {analysis.companyIntel.hiringFocus.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-primary mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Demo Mode: Company intel generated heuristically.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping */}
      {analysis.roundMapping && analysis.roundMapping.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interview Round Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysis.roundMapping.map((round, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline connector */}
                  {idx < analysis.roundMapping.length - 1 && (
                    <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Round number circle */}
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                    
                    {/* Round content */}
                    <div className="flex-1 pb-6">
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">
                        {round.round}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{round.description}</p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Why this round matters:</span>{' '}
                          {round.why}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round-wise Checklist */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Round-wise Preparation Checklist
          </CardTitle>
        </CardHeader>
          <CardContent>
          <div className="space-y-6">
            {(() => {
              // Handle both old (object) and new (array) formats
              const checklistItems = Array.isArray(analysis.checklist)
                ? analysis.checklist
                : Object.entries(analysis.checklist || {}).map(([roundTitle, items]) => ({ roundTitle, items }))
              return checklistItems
            })().map((round) => {
              const roundTitle = round.roundTitle || round
              const items = round.items || (Array.isArray(round) ? round : [])
              return (
                <div key={roundTitle}>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">{roundTitle}</h4>
                  <ul className="space-y-2">
                    {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            7-Day Preparation Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              // Handle both old (object) and new (array) formats
              const planItems = Array.isArray(analysis.plan7Days)
                ? analysis.plan7Days
                : Array.isArray(analysis.plan)
                  ? analysis.plan
                  : Object.entries(analysis.plan || {}).map(([day, tasks]) => ({ day, tasks }))
              return planItems
            })().map((planItem) => {
              const day = planItem.day || Object.keys(planItem)[0]
              const tasks = planItem.tasks || (Array.isArray(planItem) ? planItem : [])
              return (
                <div key={day} className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{day}</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            10 Likely Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(analysis.questions || []).map((q, idx) => {
              const questionText = typeof q === 'string' ? q : (q.question || '')
              const category = typeof q === 'object' ? (q.category || 'General') : 'General'
              return (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{questionText}</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">
                        {category}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Action Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weakSkills.length > 0 ? (
            <>
              <p className="text-gray-700 mb-2">Top skills to focus on:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {weakSkills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="text-gray-800 font-medium">Start Day 1 plan now.</p>
            </>
          ) : (
            <p className="text-gray-700">All listed skills marked as known. Keep revising and follow the 7-day plan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Results
