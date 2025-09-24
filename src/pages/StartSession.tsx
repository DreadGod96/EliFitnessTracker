
import React from 'react'
import { db } from '@/db/db'
import type { Template, TemplateExercise } from '@/db/types'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'

export default function StartSession() {
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [rows, setRows] = React.useState<Record<string, TemplateExercise[]>>({})
  const nav = useNavigate()
  const { startFromTemplate } = useSessionStore()

  React.useEffect(() => {
    (async () => {
      const ts = await db.templates.toArray()
      setTemplates(ts)
      const map: Record<string, TemplateExercise[]> = {}
      for (const t of ts) {
        map[t.id] = (await db.template_exercises.where('template_id').equals(t.id).toArray()).sort((a,b)=>a.order-b.order)
      }
      setRows(map)
    })()
  }, [])

  const start = async (t: Template) => {
    const id = await startFromTemplate(t, rows[t.id] ?? [])
    nav(`/session/${id}`)
  }

  return (
    <div className="grid gap-4">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Start a Session</h2>
        <ul className="space-y-2">
          {templates.map(t => (
            <li key={t.id} className="flex items-center justify-between">
              <div>{t.name}</div>
              <button className="btn" onClick={()=>start(t)}>Start</button>
            </li>
          ))}
          {templates.length === 0 && <div className="text-neutral-400">Create a template first.</div>}
        </ul>
      </section>
    </div>
  )
}
