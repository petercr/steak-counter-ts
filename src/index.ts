import { buildStreak, formattedDate, KEY, updateStreak } from "../src/lib";
import type { Streak } from "../src/lib";

function assertStreakExists(
  streakInLocalStorage: string | null
): streakInLocalStorage is string {
  return streakInLocalStorage !== null && streakInLocalStorage !== "";
}

function shouldIncrementOrRestStreakCount(
  currentDate: Date,
  lastLoginDate: string
): "increment" | "reset" | "none" {
  // Get the current date as a string, minus the date from lastLoginDate
  // split the results of lastLoginDate and take just the date
  const difference =
    currentDate.getDate() - parseInt(lastLoginDate.split("/")[1]);

  // Same day login, do nothing
  if (difference === 0) {
    return "none";
  }
  // Logged in on the next day, increment the streak
  if (difference === 1) {
    return "increment";
  }

  // the streak has ended
  return "reset";
}

export function streakCounter(storage: Storage, date: Date): Streak {
  const streakInLocalStorage = storage.getItem(KEY);
  if (streakInLocalStorage) {
    try {
      const streak = JSON.parse(streakInLocalStorage) as Streak;
      const state = shouldIncrementOrRestStreakCount(
        date,
        streak.lastLoginDate
      );
      const SHOULD_INCREMENT = state === "increment";
      const SHOULD_RESET = state === "reset";

      if (SHOULD_INCREMENT) {
        const updatedStreak = buildStreak(date, {
          startDate: streak.startDate,
          currentCount: streak.currentCount + 1,
          lastLoginDate: formattedDate(date),
        });
        // store in local storage
        updateStreak(storage, updatedStreak);

        return updatedStreak;
      }
      if (SHOULD_RESET) {
        const updatedStreak = buildStreak(date);
        // store in local storage
        updateStreak(storage, updatedStreak);

        return updatedStreak;
      }
      return streak;
    } catch (error) {
      console.error("Failed to parse streak from localStorage", error);
    }
  }

  if (assertStreakExists(streakInLocalStorage)) {
    try {
      const streak = JSON.parse(streakInLocalStorage);
      return streak;
    } catch (error) {
      console.error("Failed to parse streak from localStorage", error);
    }
  }

  const streak = buildStreak(date);
  // store in localStorage
  updateStreak(storage, streak);

  return streak;
}
