
import { create } from 'zustand'
import dayjs from 'dayjs'
import { db } from '@/db/db'
import type { Session, SessionExercise, SetEntry, ExerciseLastLoad, Template, TemplateExercise } from '@/db/types'

type SessionState = {
  activeSessionId?: string
  startFromTemplate: (template: Template, rows: TemplateExercise[]) => Promise<string>
  logSet: (setId: string, weight: number, reps: number) => Promise<void>
}

export const useSessionStore = create<SessionState>(() => ({
  activeSessionId: undefined,

  async startFromTemplate(template, rows) {
    const sessionId = crypto.randomUUID()
    const session: Session = {
      id: sessionId,
      name: template.name,
      template_id: template.id,
      started_at: dayjs().toISOString(),
    }
    await db.sessions.add(session)
    // create session exercises and planned sets
    for (const row of rows.sort((a,b) => a.order - b.order)) {
      const seId = crypto.randomUUID()
      const se: SessionExercise = {
        id: seId,
        session_id: sessionId,
        order: row.order,
        exercise_id: row.exercise_id,
        rest_seconds: row.rest_seconds,
      }
      await db.session_exercises.add(se)
      for (let i=0;i<row.planned_sets;i++) {
        const setEntry: SetEntry = {
          id: crypto.randomUUID(),
          session_exercise_id: seId,
          index: i,
          weight: 0,
          reps: row.planned_reps,
          status: 'planned',
        }
        await db.sets.add(setEntry)
      }
    }
    return sessionId
  },

  async logSet(setId, weight, reps) {
    await db.sets.update(setId, {
      weight, reps, status: 'done', logged_at: dayjs().toISOString()
    })
    // update last load
    const set = await db.sets.get(setId)
    if (!set) return
    const se = await db.session_exercises.get(set.session_exercise_id)
    if (!se) return
    const rec: ExerciseLastLoad = {
      exercise_id: se.exercise_id,
      last_weight: weight,
      last_reps: reps,
      last_date: dayjs().toISOString(),
    }
    await db.exercise_last_load.put(rec)
  },
}))
