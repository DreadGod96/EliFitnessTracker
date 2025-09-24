
import React from 'react'
import { db } from '@/db/db'
import type { Exercise, MuscleGroup } from '@/db/types'

const MG: MuscleGroup[] = ['Chest','Shoulders','Back','Quads','Hams','Glutes','Biceps','Triceps','Core']

export default function ExerciseLibrary() {
  const [items, setItems] = React.useState<Exercise[]>([])
  const [name, setName] = React.useState('')
  const [groups, setGroups] = React.useState<MuscleGroup[]>([])

  const reload = React.useCallback(() => {
    db.exercises.toArray().then(setItems)
  }, [])

  React.useEffect(() => { reload() }, [reload])

  const add = async () => {
    if (!name || groups.length === 0) return
    const ex: Exercise = { id: crypto.randomUUID(), name, muscle_groups: groups }
    await db.exercises.add(ex)
    setName(''); setGroups([]); reload()
  }
  const del = async (id: string) => {
    await db.exercises.delete(id); reload()
  }

  const toggleGroup = (g: MuscleGroup) => {
    setGroups(prev => prev.includes(g) ? prev.filter(x => x!==g) : [...prev, g])
  }

  return (
    <div className="grid gap-4">
      <section className="card">
        <h2 className="text-lg font-semibold mb-3">Add Exercise</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {MG.map(g => (
              <button key={g} className={`px-3 py-1 rounded-xl text-sm ${groups.includes(g) ? 'bg-sky-700' : 'bg-neutral-800'}`} onClick={()=>toggleGroup(g)}>
                {g}
              </button>
            ))}
          </div>
          <button className="btn" onClick={add}>Add</button>
        </div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold mb-3">Exercises</h2>
        <ul className="space-y-2">
          {items.map(ex => (
            <li key={ex.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{ex.name}</div>
                <div className="text-xs text-neutral-400">{ex.muscle_groups.join(', ')}</div>
              </div>
              <button className="btn btn-ghost" onClick={()=>del(ex.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
