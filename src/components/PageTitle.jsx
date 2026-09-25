export default function PageTitle({ title, description }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  )
}