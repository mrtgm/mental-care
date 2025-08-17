export const isSameDate = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

export const getMonthName = (monthNumber: number | undefined, locale = "en-US", format: "short" | "long" | "narrow" = "short") => {
  if (!monthNumber) return "";
  const date = new Date(2000, monthNumber - 1);
  return new Intl.DateTimeFormat(locale, { month: format }).format(date);
};

// 月のミリ秒数を計算
export const getMsOfMonth = (date: Date) => {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return nextMonth.getDate() * 24 * 60 * 60 * 1000;
};

// 月の終了日からの差分を計算
export const getMsFromMonthEnd = (date: Date) => {
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return lastDayOfMonth.getTime() - date.getTime();
};

// <時間:分>形式の文字列をミリ秒に変換
export const convertTimeToMs = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes) * 60 * 1000; // ミリ秒に変換
};

// ミリ秒を<時間:分>形式の文字列に変換
export const convertMsToTime = (ms: number): string => {
  const totalMinutes = Math.floor(ms / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
