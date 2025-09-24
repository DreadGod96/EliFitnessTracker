
import React from 'react'
import { Link } from 'react-router-dom'
import { db, seedExercises } from '@/db/db'

export default function Dashboard() {
  const [recent, setRecent] = React.useState<any[]>([])

  React.useEffect(() => {
    seedExercises()
    db.sessions.orderBy('started_at').reverse().limit(5).toArray().then(setRecent)
  }, [])

  return (
    <div className="grid gap-4">
      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Start</h2>
          <Link to="/session/new" className="btn">Start Session</Link>
        </div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Recent Sessions</h2>
        <ul className="space-y-1">
          {recent.length === 0 && <li className="text-neutral-400">No sessions yet.</li>}
          {recent.map(s => (
            <li key={s.id} className="flex items-center justify-between">
              <div>{s.name}</div>
              <Link className="btn btn-ghost" to={`/session/${s.id}`}>Open</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
