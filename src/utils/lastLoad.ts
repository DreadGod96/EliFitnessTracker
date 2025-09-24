
import { db } from '@/db/db'

export async function getLastLoadForExercise(exercise_id: string) {
  const rec = await db.exercise_last_load.get(exercise_id)
  return rec?.last_weight ?? 0
}
