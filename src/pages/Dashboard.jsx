import PageTitle from '../components/PageTitle'
import StatCard from '../components/StatCard'
import Card from '../components/Card'

export default function Dashboard() {
  return (
    <div className="p-6">

      <PageTitle
        title="Dashboard"
        description="Welcome to your business management dashboard."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Customers"
          value="248"
          description="12 new this month"
        />

        <StatCard
          title="Services"
          value="18"
          description="3 added this month"
        />

        <StatCard
          title="Appointments"
          value="42"
          description="8 scheduled today"
        />

        <StatCard
          title="Revenue"
          value="$8,420"
          description="15% increase this month"
        />

      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your recent business activities will appear here.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            Upcoming Appointments
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your upcoming appointments will appear here.
          </p>
        </Card>

      </div>

    </div>
  )
}