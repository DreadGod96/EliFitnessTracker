
import React from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@/db/db'
import type { Session, SessionExercise, SetEntry } from '@/db/types'
import { useSessionStore } from '@/stores/sessionStore'
import { getLastLoadForExercise } from '@/utils/lastLoad'
import SetRow from '@/components/SetRow'

export default function LiveSession() {
  const { id } = useParams()
  const [session, setSession] = React.useState<Session | undefined>()
  const [rows, setRows] = React.useState<(SessionExercise & { sets: SetEntry[]; exerciseName: string })[]>([])
  const { logSet } = useSessionStore()

  React.useEffect(() => {
    (async () => {
      if (!id) return
      const s = await db.sessions.get(id)
      setSession(s)
      if (!s) return
      const exRows = await db.session_exercises.where('session_id').equals(s.id).toArray()
      const out = []
      for (const r of exRows.sort((a,b)=>a.order-b.order)) {
        const sets = await db.sets.where('session_exercise_id').equals(r.id).toArray()
        const ex = await db.exercises.get(r.exercise_id)
        out.push({ ...r, sets: sets.sort((a,b)=>a.index-b.index), exerciseName: ex?.name ?? 'Exercise' })
      }
      setRows(out)
    })()
  }, [id])

  const prefillWeight = async (exercise_id: string) => {
    const w = await getLastLoadForExercise(exercise_id)
    return w || 0
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">{session?.name ?? 'Session'}</h2>
      {rows.map(r => (
        <section key={r.id} className="card">
          <div className="font-semibold mb-2">{r.exerciseName}</div>
          <div className="grid gap-2">
            {r.sets.map((s, idx) => (
              <SetRow
                key={s.id}
                index={idx}
                defaultRestSeconds={r.rest_seconds}
                initial={{ weight: s.status==='planned' ? (0 as any) : s.weight, reps: s.reps, done: s.status==='done' }}
                onCheckOff={async ({ weight, reps }) => {
                  await logSet(s.id, weight || await prefillWeight(r.exercise_id), reps)
                }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
