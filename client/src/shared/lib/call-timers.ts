const timers = new Map<string, ReturnType<typeof setTimeout>>();
 
export const clearCallTimer = (key: string) => {
  const t = timers.get(key);
  if (t) {
    clearTimeout(t);
    timers.delete(key);
  }
};
 
export const scheduleCallTimer = (key: string, ms: number, fn: () => void) => {
  clearCallTimer(key); // never leak the previous handle
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key);
      fn();
    }, ms)
  );
};
 
