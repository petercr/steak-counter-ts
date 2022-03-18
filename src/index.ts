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
      const streak = JSON.parse(streakInLocalStorage);
      const state = shouldIncrementOrRestStreakCount(
        date,
        streak.lastLoginDate
      );
      const SHOULD_INCREMENT = state === "increment";
      const SHOULD_RESET = state === "reset";

      if (SHOULD_INCREMENT) {
        const updatedStreak: Streak = {
          ...streak,
          currentCount: streak.currentCount + 1,
          lastLoginDate: formattedDate(date),
        };
        // store in local storage
        storage.setItem(KEY, JSON.stringify(updatedStreak));

        return updatedStreak;
      }
      if (SHOULD_RESET) {
        const updatedStreak: Streak = {
          ...streak,
          currentCount: 1,
          startDate: formattedDate(date),
          lastLoginDate: formattedDate(date),
        };
        // store in local storage
        storage.setItem(KEY, JSON.stringify(updatedStreak));

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

  const streak = {
    currentCount: 1,
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date),
  };
  // store in localStorage
  storage.setItem(KEY, JSON.stringify(streak));

  return streak;
}
