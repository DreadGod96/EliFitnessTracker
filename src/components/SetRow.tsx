
import React, { useState } from 'react'
import RestTimer from './RestTimer'

export type SetRowValue = {
  weight: number | ''
  reps: number | ''
  done: boolean
}

export default function SetRow({
  index,
  initial,
  onCheckOff,
  defaultRestSeconds,
}: {
  index: number
  initial: SetRowValue
  onCheckOff: (val: { weight: number; reps: number }) => void
  defaultRestSeconds: number
}) {
  const [val, setVal] = useState<SetRowValue>(initial)
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    if (val.weight === '' || val.reps === '') return
    setChecked(true)
    onCheckOff({ weight: Number(val.weight), reps: Number(val.reps) })
  }

  return (
    <div className="card grid grid-cols-[auto,1fr,auto] gap-3 items-center">
      <div className="text-neutral-400 w-8 text-center">{index + 1}</div>
      <div className="flex gap-2 items-center">
        <input
          className="input w-24"
          type="number"
          placeholder="Weight"
          value={val.weight}
          onChange={(e) => setVal(v => ({ ...v, weight: e.target.value === '' ? '' : Number(e.target.value) }))}
        />
        <input
          className="input w-20"
          type="number"
          placeholder="Reps"
          value={val.reps}
          onChange={(e) => setVal(v => ({ ...v, reps: e.target.value === '' ? '' : Number(e.target.value) }))}
        />
        <button className="btn" onClick={handleCheck} disabled={checked}>Check Off</button>
      </div>
      {checked && <RestTimer defaultSeconds={defaultRestSeconds} />}
    </div>
  )
}
