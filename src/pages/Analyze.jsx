import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { analyzeJD } from '../utils/analysisEngine'
import { saveAnalysis } from '../utils/storage'
import { FileText, Building2, Briefcase } from 'lucide-react'

function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleAnalyze = () => {
    setValidationError('')
    
    if (!jdText.trim()) {
      setValidationError('Job description is required.')
      return
    }

    if (jdText.trim().length < 200) {
      setValidationError('This JD is too short to analyze deeply. Paste full JD for better output.')
      // Still allow analysis but show warning
    }

    setIsAnalyzing(true)

    // Simulate slight delay for better UX
    setTimeout(() => {
      const analysis = analyzeJD(company, role, jdText)
      const savedEntry = saveAnalysis({
        company,
        role,
        jdText,
        ...analysis
      })

      setIsAnalyzing(false)
      navigate(`/dashboard/results?id=${savedEntry.id}`)
    }, 500)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Analyze Job Description</h2>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Enter Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4" />
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Microsoft"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4" />
              Role/Position (Optional)
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Engineer, Frontend Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Job Description Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value)
                setValidationError('')
              }}
              placeholder="Paste the complete job description here..."
              rows={12}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
                validationError && jdText.trim().length < 200
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-gray-300'
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {jdText.length} characters {jdText.length < 200 && <span className="text-amber-600">(minimum 200 recommended)</span>}
              </p>
            </div>
            {validationError && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">{validationError}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jdText.trim()}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Job Description'}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analyze
