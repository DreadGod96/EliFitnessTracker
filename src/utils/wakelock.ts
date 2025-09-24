
export async function keepAwake(on: boolean) {
  if ('wakeLock' in navigator) {
    try {
      // @ts-ignore
      const lock = on ? await navigator.wakeLock.request('screen') : null
      return () => lock && lock.release && lock.release()
    } catch {}
  }
  return () => {}
}
