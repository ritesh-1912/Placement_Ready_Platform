import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { 
  getStepsCompletion, 
  updateStepCompletion, 
  getProofSubmission, 
  saveProofSubmission,
  validateUrl,
  formatFinalSubmission,
  getAllStepsCompleted,
  getAllProofLinksProvided
} from '../utils/proofSubmission'
import { CheckCircle2, Circle, Copy, ExternalLink, AlertCircle } from 'lucide-react'

function Proof() {
  const [steps, setSteps] = useState([])
  const [submission, setSubmission] = useState({
    lovableProjectLink: '',
    githubRepoLink: '',
    deployedUrl: ''
  })
  const [errors, setErrors] = useState({})
  const [copyFeedback, setCopyFeedback] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stepsData = getStepsCompletion()
    const submissionData = getProofSubmission()
    setSteps(stepsData)
    setSubmission(submissionData)
  }

  const handleStepToggle = (stepId, completed) => {
    updateStepCompletion(stepId, completed)
    loadData()
  }

  const handleLinkChange = (field, value) => {
    setSubmission(prev => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleLinkBlur = (field, value) => {
    if (value.trim() && !validateUrl(value.trim())) {
      setErrors(prev => ({ ...prev, [field]: 'Please enter a valid URL (must start with http:// or https://)' }))
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = () => {
    const newErrors = {}
    if (submission.lovableProjectLink.trim() && !validateUrl(submission.lovableProjectLink.trim())) {
      newErrors.lovableProjectLink = 'Invalid URL'
    }
    if (submission.githubRepoLink.trim() && !validateUrl(submission.githubRepoLink.trim())) {
      newErrors.githubRepoLink = 'Invalid URL'
    }
    if (submission.deployedUrl.trim() && !validateUrl(submission.deployedUrl.trim())) {
      newErrors.deployedUrl = 'Invalid URL'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    saveProofSubmission(submission)
    setErrors({})
  }

  const handleCopySubmission = () => {
    const text = formatFinalSubmission()
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    })
  }

  const allStepsCompleted = getAllStepsCompleted()
  const allLinksProvided = getAllProofLinksProvided()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Build Proof</h2>

        {/* Step Completion Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step Completion Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    step.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => handleStepToggle(step.id, !step.completed)}
                    className="flex-shrink-0"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <span className={`flex-1 ${step.completed ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                    {step.label}
                  </span>
                  <span className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Artifact Inputs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Artifact Inputs (Required for Ship Status)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lovable Project Link <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={submission.lovableProjectLink}
                  onChange={(e) => handleLinkChange('lovableProjectLink', e.target.value)}
                  onBlur={(e) => handleLinkBlur('lovableProjectLink', e.target.value)}
                  placeholder="https://lovable.dev/project/..."
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.lovableProjectLink ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {submission.lovableProjectLink && validateUrl(submission.lovableProjectLink) && (
                  <a
                    href={submission.lovableProjectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
              {errors.lovableProjectLink && (
                <p className="text-sm text-red-600 mt-1">{errors.lovableProjectLink}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository Link <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={submission.githubRepoLink}
                  onChange={(e) => handleLinkChange('githubRepoLink', e.target.value)}
                  onBlur={(e) => handleLinkBlur('githubRepoLink', e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.githubRepoLink ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {submission.githubRepoLink && validateUrl(submission.githubRepoLink) && (
                  <a
                    href={submission.githubRepoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
              {errors.githubRepoLink && (
                <p className="text-sm text-red-600 mt-1">{errors.githubRepoLink}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deployed URL <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={submission.deployedUrl}
                  onChange={(e) => handleLinkChange('deployedUrl', e.target.value)}
                  onBlur={(e) => handleLinkBlur('deployedUrl', e.target.value)}
                  placeholder="https://your-app.vercel.app"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.deployedUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {submission.deployedUrl && validateUrl(submission.deployedUrl) && (
                  <a
                    href={submission.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
              {errors.deployedUrl && (
                <p className="text-sm text-red-600 mt-1">{errors.deployedUrl}</p>
              )}
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg"
            >
              Save Links
            </button>
          </CardContent>
        </Card>

        {/* Final Submission Export */}
        <Card>
          <CardHeader>
            <CardTitle>Final Submission Export</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={handleCopySubmission}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="w-4 h-4" />
              Copy Final Submission
            </button>
            {copyFeedback && (
              <p className="text-sm text-primary mt-2">Copied to clipboard!</p>
            )}
          </CardContent>
        </Card>

        {/* Status Summary */}
        <Card className="mt-6 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              {allStepsCompleted && allLinksProvided ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Ship Status Requirements</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className={allStepsCompleted ? 'text-green-700' : ''}>
                    {allStepsCompleted ? '✓' : '○'} All 8 steps completed
                  </li>
                  <li className={allLinksProvided ? 'text-green-700' : ''}>
                    {allLinksProvided ? '✓' : '○'} All 3 proof links provided
                  </li>
                  <li className="text-gray-500">
                    ○ All 10 test checklist items passed (check /prp/07-test)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Proof
