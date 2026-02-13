import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getAllTestsPassed, getTestsPassedCount } from '../utils/testChecklist'
import { getShippedStatus, getAllStepsCompleted, getAllProofLinksProvided } from '../utils/proofSubmission'
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react'

function Ship() {
  const navigate = useNavigate()
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const [allStepsCompleted, setAllStepsCompleted] = useState(false)
  const [allLinksProvided, setAllLinksProvided] = useState(false)
  const [shippedStatus, setShippedStatus] = useState(false)
  const [passedCount, setPassedCount] = useState(0)

  useEffect(() => {
    const testsPassed = getAllTestsPassed()
    const stepsCompleted = getAllStepsCompleted()
    const linksProvided = getAllProofLinksProvided()
    const shipped = getShippedStatus()
    const count = getTestsPassedCount()
    
    setAllTestsPassed(testsPassed)
    setAllStepsCompleted(stepsCompleted)
    setAllLinksProvided(linksProvided)
    setShippedStatus(shipped)
    setPassedCount(count)
  }, [])

  if (!shippedStatus) {
    const missingItems = []
    if (!allTestsPassed) missingItems.push(`${10 - passedCount} test checklist items`)
    if (!allStepsCompleted) missingItems.push('8 build steps')
    if (!allLinksProvided) missingItems.push('3 proof links')

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Ship</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/prp/proof')}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Proof
              </button>
              <button
                onClick={() => navigate('/prp/07-test')}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Tests
              </button>
            </div>
          </div>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ship Page Locked
                </h3>
                <p className="text-gray-700 mb-4">
                  Complete all requirements before shipping.
                </p>
                <div className="bg-white rounded-lg p-6 border border-amber-200 max-w-2xl mx-auto mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Requirements Status:</h4>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li className={`flex items-start gap-2 ${allTestsPassed ? 'text-green-700' : 'text-amber-700'}`}>
                      {allTestsPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span>All 10 test checklist items passed ({passedCount}/10)</span>
                    </li>
                    <li className={`flex items-start gap-2 ${allStepsCompleted ? 'text-green-700' : 'text-amber-700'}`}>
                      {allStepsCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span>All 8 build steps completed</span>
                    </li>
                    <li className={`flex items-start gap-2 ${allLinksProvided ? 'text-green-700' : 'text-amber-700'}`}>
                      {allLinksProvided ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span>All 3 proof links provided</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center gap-2 text-amber-700 mb-6">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Missing: {missingItems.join(', ')}
                  </span>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate('/prp/proof')}
                    className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg"
                  >
                    Go to Proof Page
                  </button>
                  <button
                    onClick={() => navigate('/prp/07-test')}
                    className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-300"
                  >
                    Go to Test Checklist
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ship</h2>

        {/* Status Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            Shipped
          </span>
        </div>

        <Card className="border-green-200 bg-green-50 mb-6">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                You built a real product.
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                Not a tutorial. Not a clone.
              </p>
              <p className="text-lg text-gray-700 mb-6 font-semibold">
                A structured tool that solves a real problem.
              </p>
              <div className="bg-white rounded-lg p-6 border border-green-200 max-w-2xl mx-auto">
                <p className="text-gray-800 font-medium text-lg">
                  This is your proof of work.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-white">
          <CardHeader>
            <CardTitle>Ship Status: Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>All 10 test checklist items passed</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>All 8 build steps completed</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>All 3 proof links provided</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Ship
