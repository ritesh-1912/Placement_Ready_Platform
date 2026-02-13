import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getHistory, deleteAnalysis } from '../utils/storage'
import { Clock, Building2, Briefcase, Trash2, TrendingUp, AlertCircle } from 'lucide-react'

function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [corruptedWarning, setCorruptedWarning] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const entries = getHistory()
      setHistory(entries)
      
      // Check if any entries were skipped (corrupted)
      const rawHistory = localStorage.getItem('placement_analysis_history')
      if (rawHistory) {
        try {
          const parsed = JSON.parse(rawHistory)
          if (Array.isArray(parsed) && parsed.length > entries.length) {
            setCorruptedWarning(true)
          }
        } catch (e) {
          // Ignore
        }
      }
    } catch (error) {
      console.error('Error loading history:', error)
      setHistory([])
    }
  }

  const handleView = (id) => {
    navigate(`/results?id=${id}`)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(id)
      loadHistory()
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (history.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Analysis History</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No analysis history yet.</p>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg"
            >
              Analyze a Job Description
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Analysis History</h2>
        <button
          onClick={() => navigate('/analyze')}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg"
        >
          New Analysis
        </button>
      </div>

      {corruptedWarning && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                One saved entry couldn't be loaded. Create a new analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {history.map((entry) => (
          <Card
            key={entry.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleView(entry.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {entry.company && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 className="w-4 h-4" />
                        <span className="font-semibold">{entry.company}</span>
                      </div>
                    )}
                    {entry.role && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{entry.role}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold text-primary">
                        Score: {entry.finalScore ?? entry.readinessScore ?? 0}/100
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, entry.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default History
