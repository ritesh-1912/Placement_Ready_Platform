import { useNavigate } from 'react-router-dom'

function Resources() {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Resources</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <p className="text-gray-600 mb-4">Learning resources and materials will appear here.</p>
        <button
          onClick={() => navigate('/dashboard/analyze')}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg"
        >
          Analyze Job Description
        </button>
      </div>
    </div>
  )
}

export default Resources
