import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getAnalysisById, getHistory, updateAnalysis } from '../utils/storage'
import OverallReadiness from '../components/dashboard/OverallReadiness'
import { CheckCircle2, Calendar, HelpCircle, Tag, Copy, Download, Target } from 'lucide-react'

const DEFAULT_CONFIDENCE = 'practice'

function getBaseScore(analysis) {
  const base = analysis.baseReadinessScore ?? analysis.readinessScore
  return typeof base === 'number' ? base : 0
}

function getAllSkills(extractedSkills) {
  const list = []
  if (!extractedSkills) return list
  Object.keys(extractedSkills).forEach((category) => {
    const skills = extractedSkills[category]?.skills || []
    skills.forEach((skill) => list.push({ skill, category }))
  })
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
  return Object.entries(plan)
    .map(([day, tasks]) => `${day}\n${(tasks || []).map((t) => `  • ${t}`).join('\n')}`)
    .join('\n\n')
}

function formatChecklistAsText(checklist) {
  if (!checklist) return ''
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
        updateAnalysis(analysis.id, { skillConfidenceMap: next, readinessScore: liveScore })
        setAnalysis((prev) => (prev ? { ...prev, skillConfidenceMap: next, readinessScore: liveScore } : null))
      }
    },
    [analysis, skillConfidenceMap]
  )

  const allSkills = analysis ? getAllSkills(analysis.extractedSkills) : []
  const baseScore = analysis ? getBaseScore(analysis) : 0
  const liveScore = analysis ? computeLiveScore(baseScore, skillConfidenceMap, allSkills) : 0
  const displayScore = analysis?.skillConfidenceMap && Object.keys(analysis.skillConfidenceMap).length > 0
    ? liveScore
    : (analysis ? computeLiveScore(baseScore, {}, allSkills) : 0)

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
              {Object.keys(analysis.extractedSkills || {}).map((category) => {
                const skills = analysis.extractedSkills[category]?.skills || []
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
            {Object.keys(analysis.checklist || {}).map((round) => (
              <div key={round}>
                <h4 className="font-semibold text-lg text-gray-900 mb-3">{round}</h4>
                <ul className="space-y-2">
                  {(analysis.checklist[round] || []).map((item, idx) => (
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
            {Object.entries(analysis.plan || {}).map(([day, tasks]) => (
              <div key={day} className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">{day}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {(tasks || []).map((task, idx) => (
                    <li key={idx}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {(analysis.questions || []).map((q, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{q.question}</p>
                    <span className="text-xs text-gray-500 mt-1 inline-block">
                      {q.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
