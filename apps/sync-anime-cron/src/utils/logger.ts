export const createLogger = (name: string, fn: string) => ({
  log(...args: Parameters<typeof console.log>) {
    console.log.apply(console, [`[${name}-${fn}]`, "{log}", ...args]);
  },
  error(...args: Parameters<typeof console.error>) {
    console.error.apply(console, [`[${name}-${fn}]`, "{error}", ...args]);
  },
});
