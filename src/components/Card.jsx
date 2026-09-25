export default function Card({ children }) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
      {children}
    </div>
  )
}