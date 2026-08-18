/**
 * Runs a read that a page can still render without. Listing sections are optional
 * content, so a transient database outage costs that one section its data rather than
 * turning the whole page into a 500. Detail pages deliberately do not use this: a
 * project or post page has nothing to show without its record, so it should surface
 * the error boundary instead of rendering an empty shell.
 */
export async function safeQuery<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[db] ${label} unavailable:`, (error as Error).message);
    return fallback;
  }
}
