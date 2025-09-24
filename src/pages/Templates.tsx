
import React from 'react'
import { db } from '@/db/db'
import type { Template, TemplateExercise, Exercise } from '@/db/types'

export default function Templates() {
  const [list, setList] = React.useState<Template[]>([])
  const [exercises, setExercises] = React.useState<Exercise[]>([])
  const [name, setName] = React.useState('')
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [rows, setRows] = React.useState<TemplateExercise[]>([])

  const reload = React.useCallback(async () => {
    setList(await db.templates.toArray())
    setExercises(await db.exercises.toArray())
  }, [])

  React.useEffect(() => { reload() }, [reload])

  const createTemplate = async () => {
    if (!name) return
    const t: Template = { id: crypto.randomUUID(), name }
    await db.templates.add(t)
    setName('')
    reload()
  }

  const openEditor = async (id: string) => {
    setEditingId(id)
    const r = await db.template_exercises.where('template_id').equals(id).toArray()
    setRows(r.sort((a,b)=>a.order-b.order))
  }

  const addRow = async () => {
    if (!editingId || exercises.length === 0) return
    const te: TemplateExercise = {
      id: crypto.randomUUID(),
      template_id: editingId,
      order: rows.length,
      exercise_id: exercises[0].id,
      planned_sets: 3,
      planned_reps: 5,
      rest_seconds: 120,
    }
    await db.template_exercises.add(te)
    openEditor(editingId)
  }

  const updateRow = async (id: string, patch: Partial<TemplateExercise>) => {
    await db.template_exercises.update(id, patch)
    if (editingId) openEditor(editingId)
  }

  const delRow = async (id: string) => {
    await db.template_exercises.delete(id)
    if (editingId) openEditor(editingId)
  }

  return (
    <div className="grid gap-4">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Create Template</h2>
        <div className="flex items-center gap-2">
          <input className="input" placeholder="Template name" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn" onClick={createTemplate}>Create</button>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Templates</h2>
        <ul className="space-y-1">
          {list.map(t => (
            <li key={t.id} className="flex items-center justify-between">
              <div>{t.name}</div>
              <div className="flex gap-2">
                <button className="btn btn-ghost" onClick={()=>openEditor(t.id)}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {editingId && (
        <section className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Template Rows</h3>
            <button className="btn" onClick={addRow}>Add Row</button>
          </div>
          <div className="grid gap-2">
            {rows.map(r => (
              <div key={r.id} className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-2 items-center">
                <select
                  className="input"
                  value={r.exercise_id}
                  onChange={e=>updateRow(r.id,{ exercise_id: e.target.value })}
                >
                  {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </select>
                <input className="input w-24" type="number" value={r.planned_sets} onChange={e=>updateRow(r.id,{ planned_sets: Number(e.target.value) })} />
                <input className="input w-24" type="number" value={r.planned_reps} onChange={e=>updateRow(r.id,{ planned_reps: Number(e.target.value) })} />
                <input className="input w-28" type="number" value={r.rest_seconds} onChange={e=>updateRow(r.id,{ rest_seconds: Number(e.target.value) })} />
                <button className="btn btn-ghost" onClick={()=>delRow(r.id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
