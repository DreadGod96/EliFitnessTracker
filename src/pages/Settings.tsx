
import React from 'react'
import useSettingsStore from '@/stores/settingsStore'

export default function Settings() {
  const { units, setUnits, restIncrementSeconds, setRestIncrement } = useSettingsStore()
  return (
    <div className="card grid gap-4">
      <div>
        <div className="label mb-1">Units</div>
        <select className="input" value={units} onChange={e=>setUnits(e.target.value as any)}>
          <option value="lb">Pounds (lb)</option>
          <option value="kg">Kilograms (kg)</option>
        </select>
      </div>
      <div>
        <div className="label mb-1">Rest Increment (seconds)</div>
        <select className="input" value={restIncrementSeconds} onChange={e=>setRestIncrement(Number(e.target.value))}>
          {[5,10,15,30].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  )
}
