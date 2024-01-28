export {};

declare global {
  type AwaitedReturnType<T> = T extends (...args: any[]) => Promise<infer R>
    ? R
    : never;
}
