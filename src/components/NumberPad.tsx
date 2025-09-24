
import React from 'react'

export default function NumberPad({ onKey }: { onKey: (val: string) => void }) {
  const keys = ['7','8','9','4','5','6','1','2','3','0','.','←']
  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map(k => (
        <button
          key={k}
          className="btn bg-neutral-800 hover:bg-neutral-700"
          onClick={() => onKey(k)}
          type="button"
        >
          {k}
        </button>
      ))}
    </div>
  )
}
