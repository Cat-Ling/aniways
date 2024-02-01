export type AwaitedReturnType<T> = T extends (
  // eslint-disable-next-line no-unused-vars
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;
