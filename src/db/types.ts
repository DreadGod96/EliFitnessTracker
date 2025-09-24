
export type MuscleGroup = 'Chest'|'Shoulders'|'Back'|'Quads'|'Hams'|'Glutes'|'Biceps'|'Triceps'|'Core'

export interface Exercise {
  id: string
  name: string
  equipment?: string
  muscle_groups: MuscleGroup[]
  tags?: string[]
}

export interface Template {
  id: string
  name: string
  notes?: string
}

export interface TemplateExercise {
  id: string
  template_id: string
  order: number
  exercise_id: string
  planned_sets: number
  planned_reps: number
  rest_seconds: number
}

export interface Session {
  id: string
  name: string
  template_id?: string
  notes?: string
  started_at: string
  ended_at?: string
}

export interface SessionExercise {
  id: string
  session_id: string
  order: number
  exercise_id: string
  rest_seconds: number
}

export interface SetEntry {
  id: string
  session_exercise_id: string
  index: number
  weight: number
  reps: number
  status: 'planned'|'done'
  logged_at?: string
}

export interface RestPeriod {
  id: string
  set_id: string
  planned_seconds: number
  actual_seconds: number
  started_at: string
  ended_at: string
}

export interface ExerciseLastLoad {
  exercise_id: string
  last_weight: number
  last_reps: number
  last_date: string
}
