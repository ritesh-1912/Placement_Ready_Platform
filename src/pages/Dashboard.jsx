import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import OverallReadiness from '../components/dashboard/OverallReadiness'
import SkillBreakdown from '../components/dashboard/SkillBreakdown'
import ContinuePractice from '../components/dashboard/ContinuePractice'
import WeeklyGoals from '../components/dashboard/WeeklyGoals'
import UpcomingAssessments from '../components/dashboard/UpcomingAssessments'

function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Readiness */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <OverallReadiness score={72} max={100} />
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBreakdown />
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <ContinuePractice />
        </Card>

        {/* Weekly Goals */}
        <Card>
          <WeeklyGoals />
        </Card>

        {/* Upcoming Assessments */}
        <Card className="lg:col-span-2">
          <UpcomingAssessments />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
