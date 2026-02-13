import { Clock } from 'lucide-react'

const assessments = [
  { title: 'DSA Mock Test', date: 'Tomorrow', time: '10:00 AM' },
  { title: 'System Design Review', date: 'Wed', time: '2:00 PM' },
  { title: 'HR Interview Prep', date: 'Friday', time: '11:00 AM' },
]

function UpcomingAssessments() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assessments</h3>
      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{assessment.title}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{assessment.date}, {assessment.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingAssessments
