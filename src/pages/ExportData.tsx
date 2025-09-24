
import React from 'react'
import { db } from '@/db/db'
import { toCSV, download } from '@/utils/csv'

export default function ExportData() {
  const exportJSON = async () => {
    const payload = {
      exercises: await db.exercises.toArray(),
      templates: await db.templates.toArray(),
      template_exercises: await db.template_exercises.toArray(),
      sessions: await db.sessions.toArray(),
      session_exercises: await db.session_exercises.toArray(),
      sets: await db.sets.toArray(),
      rest_periods: await db.rest_periods.toArray(),
      exercise_last_load: await db.exercise_last_load.toArray(),
    }
    download('workouts.json', JSON.stringify(payload, null, 2), 'application/json')
  }

  const exportCSV = async () => {
    const sets = await db.sets.toArray()
    download('sets.csv', toCSV(sets))
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Export</h2>
      <div className="flex gap-2">
        <button className="btn" onClick={exportJSON}>Export JSON</button>
        <button className="btn" onClick={exportCSV}>Export Sets CSV</button>
      </div>
    </div>
  )
}
