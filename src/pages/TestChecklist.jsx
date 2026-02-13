import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getTestChecklist, updateTestChecklist, resetTestChecklist, getTestsPassedCount, getAllTestsPassed } from '../utils/testChecklist'
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'

function TestChecklist() {
  const [tests, setTests] = useState([])
  const [passedCount, setPassedCount] = useState(0)
  const [allPassed, setAllPassed] = useState(false)

  useEffect(() => {
    loadChecklist()
  }, [])

  const loadChecklist = () => {
    const checklist = getTestChecklist()
    setTests(checklist)
    const count = getTestsPassedCount()
    setPassedCount(count)
    setAllPassed(getAllTestsPassed())
  }

  const handleToggle = (testId, checked) => {
    updateTestChecklist(testId, checked)
    loadChecklist()
  }

  const handleReset = () => {
    if (confirm('Reset all test checkboxes? This will unlock the Ship page if it was locked.')) {
      resetTestChecklist()
      loadChecklist()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Test Checklist</h2>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" />
          Reset checklist
        </button>
      </div>

      {/* Summary */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Tests Passed: {passedCount} / {tests.length}
              </h3>
              {allPassed ? (
                <div className="flex items-center gap-2 text-green-600 mt-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">All tests passed! Ready to ship.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 mt-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Fix issues before shipping.</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {Math.round((passedCount / tests.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Items */}
      <Card>
        <CardHeader>
          <CardTitle>Test Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-lg border ${
                  test.checked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={test.checked}
                    onChange={(e) => handleToggle(test.id, e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={test.id}
                      className={`font-medium cursor-pointer ${
                        test.checked ? 'text-green-800' : 'text-gray-900'
                      }`}
                    >
                      {test.label}
                    </label>
                    {test.hint && (
                      <p className="text-sm text-gray-600 mt-1 ml-0">
                        <span className="font-medium">How to test:</span> {test.hint}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default TestChecklist
