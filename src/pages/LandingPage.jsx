import { useNavigate } from 'react-router-dom'
import { Code, Video, TrendingUp } from 'lucide-react'

function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Code,
      title: 'Practice Problems',
      description: 'Solve coding challenges and improve your problem-solving skills',
    },
    {
      icon: Video,
      title: 'Mock Interviews',
      description: 'Practice with realistic interview scenarios and get feedback',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and insights',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ace Your Placement
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Practice, assess, and prepare for your dream job
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Placement Ready Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
