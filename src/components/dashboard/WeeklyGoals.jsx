function WeeklyGoals() {
  const solved = 12
  const goal = 20
  const percentage = (solved / goal) * 100

  const days = [
    { label: 'Mon', active: true },
    { label: 'Tue', active: true },
    { label: 'Wed', active: false },
    { label: 'Thu', active: true },
    { label: 'Fri', active: false },
    { label: 'Sat', active: true },
    { label: 'Sun', active: false },
  ]

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h3>
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">Problems Solved</span>
          <span className="text-gray-600">{solved}/{goal} this week</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                day.active
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {day.label[0]}
            </div>
            <span className="text-xs text-gray-600">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyGoals
