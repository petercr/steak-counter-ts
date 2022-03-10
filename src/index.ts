import { formattedDate } from "../src/lib";

// Used when storing in localStorage
const KEY = "streak";

interface Streak {
  currentCount: number;
  startDate: string;
  lastLoginDate: string;
}

function assertStreakExists(
  streakInLocalStorage: string | null
): streakInLocalStorage is string {
  return streakInLocalStorage !== null && streakInLocalStorage !== "";
}

export function streakCounter(storage: Storage, date: Date): Streak {
  const streakInLocalStorage = storage.getItem(KEY);
  const doesStreakExist =
    streakInLocalStorage !== null && streakInLocalStorage !== "";

  if (assertStreakExists(streakInLocalStorage)) {
    try {
      const streak = JSON.parse(streakInLocalStorage);
      return streak;
    } catch (error) {
      console.error("Failed to parse streak from localStorage", error);
    }
  }

  const streak = {
    currentCount: 1,
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date),
  };
  // store in localStorage
  storage.setItem(KEY, JSON.stringify(streak));

  return streak;
}
