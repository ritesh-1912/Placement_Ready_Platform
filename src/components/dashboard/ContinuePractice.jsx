import { ArrowRight } from 'lucide-react'

function ContinuePractice() {
  const completed = 3
  const total = 10
  const percentage = (completed / total) * 100

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Practice</h3>
      <div className="mb-4">
        <p className="text-gray-700 font-medium mb-2">Dynamic Programming</p>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completed}/{total} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ContinuePractice
