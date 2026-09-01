export type Stage = 1 | 2 | 3 | 4;

/**
 * Maps a course week (1–12) to one of four visual-progression stages.
 * Weeks 1–3 stay closest to the formal brand baseline; by weeks 10–12 the
 * page has fully become "lived-in". Out-of-range weeks clamp to an end stage
 * rather than throw, since content authors will pass whatever `week` exists.
 */
export function weekToStage(week: number): Stage {
  if (week <= 3) return 1;
  if (week <= 6) return 2;
  if (week <= 9) return 3;
  return 4;
}
