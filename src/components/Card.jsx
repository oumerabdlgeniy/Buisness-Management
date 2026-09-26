export default function Card({ children, className = '' }) {
  return (
    <div className={`min-w-0 rounded-lg border border-slate-200/80 bg-white/90 p-6 shadow-[0_8px_24px_-20px_rgba(23,43,40,0.35)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90 ${className}`}>
      {children}
    </div>
  )
}