import { unstable_cache } from "next/cache";

export async function getCached<T>(
  key: string,
  fn: () => Promise<T>,
  expires = 1000 * 60 * 60 * 24, // 1 day
) {
  return unstable_cache(fn, [key], {
    tags: [key],
    revalidate: expires,
  })();
}
