import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getAnalysisById, getHistory } from '../utils/storage'
import OverallReadiness from '../components/dashboard/OverallReadiness'
import { CheckCircle2, Calendar, HelpCircle, Tag } from 'lucide-react'

function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = searchParams.get('id')
    const history = getHistory()

    if (id) {
      const entry = getAnalysisById(id)
      if (entry) {
        setAnalysis(entry)
      } else {
        // Fallback to latest
        if (history.length > 0) {
          setAnalysis(history[0])
        }
      }
    } else {
      // Show latest analysis
      if (history.length > 0) {
        setAnalysis(history[0])
      }
    }

    setLoading(false)
  }, [searchParams])

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
        {/* Overall Readiness */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <OverallReadiness score={analysis.readinessScore} max={100} />
          </CardContent>
        </Card>

        {/* Key Skills Extracted */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Key Skills Extracted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(analysis.extractedSkills).map((category) => {
                const skills = analysis.extractedSkills[category]?.skills || []
                if (skills.length === 0) return null

                return (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

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
            {Object.keys(analysis.checklist).map((round) => (
              <div key={round}>
                <h4 className="font-semibold text-lg text-gray-900 mb-3">{round}</h4>
                <ul className="space-y-2">
                  {analysis.checklist[round].map((item, idx) => (
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
            {Object.keys(analysis.plan).map((day) => (
              <div key={day} className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">{day}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {analysis.plan[day].map((task, idx) => (
                    <li key={idx}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            10 Likely Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.questions.map((q, idx) => (
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
    </div>
  )
}

export default Results
