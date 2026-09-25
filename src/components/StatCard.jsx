import Card from './Card'

export default function StatCard({ title, value, description }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </Card>
  )
}