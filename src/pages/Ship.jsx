import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getAllTestsPassed, getTestsPassedCount } from '../utils/testChecklist'
import { Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

function Ship() {
  const navigate = useNavigate()
  const [allPassed, setAllPassed] = useState(false)
  const [passedCount, setPassedCount] = useState(0)

  useEffect(() => {
    const passed = getAllTestsPassed()
    const count = getTestsPassedCount()
    setAllPassed(passed)
    setPassedCount(count)
  }, [])

  if (!allPassed) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Ship</h2>
          <button
            onClick={() => navigate('/prp/07-test')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tests
          </button>
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
                Complete all tests in the Test Checklist before shipping.
              </p>
              <div className="flex items-center justify-center gap-2 text-amber-700 mb-6">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  Tests Passed: {passedCount} / 10
                </span>
              </div>
              <button
                onClick={() => navigate('/prp/07-test')}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg"
              >
                Go to Test Checklist
              </button>
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

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Ship!
            </h3>
            <p className="text-gray-700 mb-6">
              All tests have passed. The Placement Readiness Platform is ready for deployment.
            </p>
            <div className="bg-white rounded-lg p-6 border border-green-200 max-w-2xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-4">Pre-Ship Checklist:</h4>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All 10 tests passed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>No console errors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Features working as expected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Data persistence verified</span>
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

export default Ship
