
import React from 'react'
import { db } from '@/db/db'
import type { Exercise, SetEntry } from '@/db/types'

export default function Analytics() {
  const [volume, setVolume] = React.useState<Record<string, number>>({})
  const [trend, setTrend] = React.useState<{ exercise: string, date: string, weight: number }[]>([])
  const [exercises, setExercises] = React.useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = React.useState<string>('')

  React.useEffect(() => {
    (async () => {
      const exs = await db.exercises.toArray()
      setExercises(exs)
      if (exs[0]) setSelectedExercise(exs[0].id)
      // weekly volume: sum weight across sets per muscle group
      const sets = await db.sets.toArray()
      const map: Record<string, number> = {}
      for (const s of sets.filter(s => s.status==='done')) {
        const se = await db.session_exercises.get(s.session_exercise_id)
        if (!se) continue
        const ex = await db.exercises.get(se.exercise_id)
        if (!ex) continue
        const total = s.weight * s.reps
        for (const g of ex.muscle_groups) {
          map[g] = (map[g] ?? 0) + total
        }
      }
      setVolume(map)
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      if (!selectedExercise) return
      const sets = await db.sets.toArray()
      const points: { exercise: string, date: string, weight: number }[] = []
      for (const s of sets.filter(s => s.status==='done')) {
        const se = await db.session_exercises.get(s.session_exercise_id)
        if (se?.exercise_id === selectedExercise) {
          const sess = await db.sessions.get(se.session_id)
          if (!sess) continue
          points.push({ exercise: selectedExercise, date: sess.started_at, weight: s.weight })
        }
      }
      points.sort((a,b)=>a.date.localeCompare(b.date))
      setTrend(points.slice(-20))
    })()
  }, [selectedExercise])

  return (
    <div className="grid gap-4">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Weekly Volume by Muscle Group</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.keys(volume).length === 0 && <div className="text-neutral-400">No data yet.</div>}
          {Object.entries(volume).map(([g, v]) => (
            <li key={g} className="flex items-center justify-between bg-neutral-800 rounded-xl px-3 py-2">
              <div>{g}</div><div className="tabular-nums">{Math.round(v)}</div>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Weight Progression</h2>
          <select className="input" value={selectedExercise} onChange={e=>setSelectedExercise(e.target.value)}>
            {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        </div>
        <div className="grid gap-1">
          {trend.length === 0 && <div className="text-neutral-400">No data yet.</div>}
          {trend.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div>{new Date(p.date).toLocaleDateString()}</div>
              <div className="tabular-nums">{p.weight}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
