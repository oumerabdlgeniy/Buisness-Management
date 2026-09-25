
import { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import { LanguageContext } from '../context/LanguageProvider'
import { translations } from '../data/data'
import { readStorage } from '../utils/storage'

const initialTasks = [
  { id: 1, title: 'Follow up with Ahmed Ali', completed: false },
  { id: 2, title: 'Prepare graphic design proposal', completed: true },
  { id: 3, title: 'Check tomorrow appointments', completed: false },
]

export default function Tasks() {
  const { language } = useContext(LanguageContext)
  const t = translations[language] || translations.en

  const [tasks, setTasks] = useState(() => {
    return readStorage('tasks', initialTasks)
  })
  const [taskTitle, setTaskTitle] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (taskTitle.trim() === '') return

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setTaskTitle('')
  }

  const handleToggle = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="p-6">
      <PageTitle
        title={t.tasks}
        description={t.tasksDescription}
      />

      <Card className="mb-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder={t.enterNewTask}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            {t.addTask}
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t.taskList}
        </h2>

        {tasks.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            {t.noTasks}
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    className="h-5 w-5"
                  />

                  <span
                    className={
                      task.completed
                        ? 'text-slate-400 line-through'
                        : 'text-slate-800 dark:text-white'
                    }
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className="rounded-lg bg-slate-200 px-3 py-2 text-sm hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                  >
                    {task.completed ? t.undo : t.done}
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
