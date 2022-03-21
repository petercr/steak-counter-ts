export function formattedDate(date: Date): string {
  return date.toLocaleDateString();
}

export interface Streak {
  currentCount: number;
  startDate: string;
  lastLoginDate: string;
}

export function buildStreak(
  date: Date,
  overrideDefaults?: Partial<Streak>
): Streak {
  const defaults: Streak = {
    currentCount: 1,
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date),
  };

  return {
    ...defaults,
    ...overrideDefaults,
  };
}

// Used when storing in localStorage
export const KEY = "streak";

export function updateStreak(storage: Storage, streak: Streak): void {
  storage.setItem(KEY, JSON.stringify(streak));
}
