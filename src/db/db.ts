
import Dexie, { Table } from 'dexie'
import type {
  Exercise, Template, TemplateExercise, Session, SessionExercise, SetEntry, RestPeriod, ExerciseLastLoad
} from './types'

export class WorkoutDB extends Dexie {
  exercises!: Table<Exercise, string>
  templates!: Table<Template, string>
  template_exercises!: Table<TemplateExercise, string>
  sessions!: Table<Session, string>
  session_exercises!: Table<SessionExercise, string>
  sets!: Table<SetEntry, string>
  rest_periods!: Table<RestPeriod, string>
  exercise_last_load!: Table<ExerciseLastLoad, string>

  constructor() {
    super('workout_db')
    this.version(1).stores({
      exercises: 'id, name',
      templates: 'id, name',
      template_exercises: 'id, template_id, order, exercise_id',
      sessions: 'id, started_at',
      session_exercises: 'id, session_id, order',
      sets: 'id, session_exercise_id, index, status',
      rest_periods: 'id, set_id',
      exercise_last_load: 'exercise_id'
    })
  }
}

export const db = new WorkoutDB()

export async function seedExercises() {
  const count = await db.exercises.count()
  if (count > 0) return
  const seed: Exercise[] = [
    { id: crypto.randomUUID(), name: 'Back Squat', muscle_groups: ['Quads','Glutes','Hams'] },
    { id: crypto.randomUUID(), name: 'Bench Press', muscle_groups: ['Chest','Triceps','Shoulders'] },
    { id: crypto.randomUUID(), name: 'Deadlift', muscle_groups: ['Back','Glutes','Hams'] },
    { id: crypto.randomUUID(), name: 'Overhead Press', muscle_groups: ['Shoulders','Triceps','Chest'] },
    { id: crypto.randomUUID(), name: 'Barbell Row', muscle_groups: ['Back','Biceps'] },
    { id: crypto.randomUUID(), name: 'Bicep Curl', muscle_groups: ['Biceps'] },
    { id: crypto.randomUUID(), name: 'Tricep Pushdown', muscle_groups: ['Triceps'] },
    { id: crypto.randomUUID(), name: 'Plank', muscle_groups: ['Core'] },
  ]
  await db.exercises.bulkAdd(seed)
}
