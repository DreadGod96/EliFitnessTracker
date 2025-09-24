
import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import useSettingsStore from '@/stores/settingsStore'

type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'canceled'

export default function RestTimer({
  defaultSeconds,
  onComplete,
}: {
  defaultSeconds: number
  onComplete?: () => void
}) {
  const increment = useSettingsStore(s => s.restIncrementSeconds)
  const [state, setState] = useState<TimerState>('idle')
  const [remaining, setRemaining] = useState(defaultSeconds)
  const endAtRef = useRef<number | null>(null)

  useEffect(() => {
    let raf: number
    const tick = () => {
      if (state === 'running' && endAtRef.current) {
        const now = Date.now()
        const rem = Math.max(0, Math.round((endAtRef.current - now) / 1000))
        setRemaining(rem)
        if (rem <= 0) {
          setState('completed')
          onComplete?.()
        } else {
          raf = requestAnimationFrame(tick)
        }
      }
    }
    if (state === 'running') {
      raf = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(raf)
  }, [state, onComplete])

  const start = () => {
    setState('running')
    endAtRef.current = Date.now() + remaining * 1000
  }
  const pause = () => {
    setState('paused')
    endAtRef.current = null
  }
  const resume = () => {
    setState('running')
    endAtRef.current = Date.now() + remaining * 1000
  }
  const adjust = (delta: number) => {
    setRemaining(r => Math.max(0, r + delta))
    if (state === 'running' && endAtRef.current) {
      endAtRef.current += delta * 1000
    }
  }
  const reset = () => {
    setState('idle')
    setRemaining(defaultSeconds)
    endAtRef.current = null
  }

  const mmss = (s: number) => dayjs().startOf('day').add(s, 'second').format('mm:ss')

  return (
    <div className="card flex items-center justify-between gap-3">
      <div>
        <div className="text-xs text-neutral-400">Rest Timer</div>
        <div className="kpi tabular-nums">{mmss(remaining)}</div>
      </div>
      <div className="flex gap-2">
        {state === 'idle' && <button className="btn" onClick={start}>Start</button>}
        {state === 'running' && <button className="btn btn-ghost" onClick={pause}>Pause</button>}
        {state === 'paused' && <button className="btn" onClick={resume}>Resume</button>}
        <button className="btn btn-ghost" onClick={() => adjust(increment)}>+{increment}s</button>
        <button className="btn btn-ghost" onClick={() => adjust(-increment)}>-{increment}s</button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
