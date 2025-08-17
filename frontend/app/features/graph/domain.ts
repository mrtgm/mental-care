import * as z from "zod";
import { type CalenderEvent, calculateMoodScore } from "@/features/calender/domains/events/domain";
import { convertMsToTime, convertTimeToMs, formatDate, getMonthName, getMsFromMonthEnd, getMsOfMonth } from "@/utils/date";
import { floorToPrecision } from "@/utils/math";
import { PLOT_AREA } from "./constants";

export const TargetTypeSchema = z.enum(["bedtime", "wakeuptime", "mood"]);
export type TargetType = z.infer<typeof TargetTypeSchema>;

export const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expecting YYYY-MM-DD")
  .refine((dateStr) => {
    const date = new Date(dateStr);
    return !Number.isNaN(date.getTime()) && dateStr === formatDate(date);
  }, "invalid date");

export type DateString = z.infer<typeof DateStringSchema>;

// グラフのX,Y軸の設定
export type AxisConfig<T> = {
  maxPointPerViewport?: number;
  totalPoint: number;
  startValue: T;
  gap: number;
  // 値をその軸の座標に変換する
  getCoordByValue: (value: T) => number;
  // 指定した目盛りの値を取得する
  getValueByTick: (tickIndex: number) => T;
  // 値をラベル用にフォーマットする
  getLabel: (value: T) => string;
};

// X方向の論理サイズの合計
export type LogicalTotalWidth = {
  value: number;
  withoutMargin: number;
};

export type Point = {
  x: number;
  y: number;
};

export const mapDateToXAxis = (value: number, xAxisConfig: AxisConfig<number>): number => {
  if (typeof value !== "number") throw new Error("Value must be a number");

  const date = new Date(value);
  date.setHours(0, 0, 0, 0); // 時間を0に設定して日付のみを考慮

  const startDate = new Date(xAxisConfig.startValue);
  startDate.setHours(0, 0, 0, 0);

  if (date.getTime() > startDate.getTime()) throw new Error("Date cannot be in the future");

  // 月の開始日を基準にして、X座標を計算
  let index = 0;

  startDate.setDate(1);
  while (date.getTime() < startDate.getTime()) {
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);
    index++;
  }

  // 行き過ぎた分を計算してX座標を調整
  const x = (index - 1) * xAxisConfig.gap + floorToPrecision(getMsFromMonthEnd(date) / getMsOfMonth(date), 100) * xAxisConfig.gap;

  // 全体の幅から引く
  const logicalTotalWidth = xAxisConfig.gap * (xAxisConfig.totalPoint - 1);
  return logicalTotalWidth - x;
};

export const mapMsToYAxis = (value: number, yAxisConfig: AxisConfig<number>): number => {
  if (typeof value !== "number") throw new Error("Value must be a number");
  const maxValue = yAxisConfig.getValueByTick(yAxisConfig.totalPoint - 1);
  const range = maxValue - yAxisConfig.startValue;

  const y = ((maxValue - value) / range) * PLOT_AREA.height;
  return y;
};

const BEDTIME_START_TIME = "19:00";
const WAKEUP_START_TIME = "4:00";

export const BEDTIME_COLOR = "#007bff";
export const WAKEUP_COLOR = "#dc3545";
export const MOOD_COLOR = "#ffc0cb";

const bedTimeYAxisConfig: AxisConfig<number> = {
  totalPoint: 12,
  startValue: convertTimeToMs(BEDTIME_START_TIME),
  get gap() {
    return PLOT_AREA.height / (this.totalPoint - 1);
  },
  getValueByTick: (index) => bedTimeYAxisConfig.startValue + index * (60 * 60 * 1000),
  getCoordByValue: (value) => mapMsToYAxis(value, bedTimeYAxisConfig),
  getLabel: (value) => convertMsToTime(value),
};

const wakeUpTimeYAxisConfig: AxisConfig<number> = {
  totalPoint: 12,
  startValue: convertTimeToMs(WAKEUP_START_TIME),
  get gap() {
    return PLOT_AREA.height / (this.totalPoint - 1);
  },
  getValueByTick: (index) => wakeUpTimeYAxisConfig.startValue + index * (60 * 60 * 1000),
  getCoordByValue: (value) => mapMsToYAxis(value, wakeUpTimeYAxisConfig),
  getLabel: (value) => convertMsToTime(value),
};

const moodYAxisConfig: AxisConfig<number> = {
  totalPoint: 5,
  startValue: 0,
  get gap() {
    return PLOT_AREA.height / (this.totalPoint - 1);
  },
  getValueByTick: (index) => ((100 / (moodYAxisConfig.totalPoint - 1)) * index) | 0,
  getCoordByValue: (value) => mapMsToYAxis(value, moodYAxisConfig),
  getLabel: (value) => `${value}`,
};

const mapEventsBedtimeToPoint = (events: CalenderEvent[], xAxisConfig: AxisConfig<number>, yAxisConfig: AxisConfig<number>): Point[] => {
  return events.map((event) => {
    const x = xAxisConfig.getCoordByValue(new Date(event.year, event.month - 1, event.date).getTime());
    const ms = convertTimeToMs(event.bedTime);
    // 午前時間の場合は24時間を加算
    // TODO: この辺、バックエンドで返す値を統一したほうがいい　フロントエンドにあんまロジック入れたくない
    const actualBedTimeMs = ms < 12 * 60 * 60 * 1000 ? 24 * 60 * 60 * 1000 + ms : ms;
    const y = yAxisConfig.getCoordByValue(actualBedTimeMs);
    return { x, y };
  });
};

const mapEventsWakeUpTimeToPoint = (events: CalenderEvent[], xAxisConfig: AxisConfig<number>, yAxisConfig: AxisConfig<number>): Point[] => {
  return events.map((event) => {
    const x = xAxisConfig.getCoordByValue(new Date(event.year, event.month - 1, event.date).getTime());
    const ms = convertTimeToMs(event.wakeUpTime);
    const y = yAxisConfig.getCoordByValue(ms);
    return { x, y };
  });
};

const mapEventsMoodToPoint = (events: CalenderEvent[], xAxisConfig: AxisConfig<number>, yAxisConfig: AxisConfig<number>): Point[] => {
  return events.map((event) => {
    const x = xAxisConfig.getCoordByValue(new Date(event.year, event.month - 1, event.date).getTime());
    const mood = calculateMoodScore(event.mood);
    const y = yAxisConfig.getCoordByValue(mood);
    return { x, y };
  });
};

export const createYAxisConfig = (target: TargetType): AxisConfig<number> => {
  if (target === "bedtime") {
    return bedTimeYAxisConfig;
  } else if (target === "wakeuptime") {
    return wakeUpTimeYAxisConfig;
  }
  return moodYAxisConfig;
};

const X_AXIS_TOTAL_POINTS = 12;
const X_AXIS_MAX_POINT_PER_VIEWPORT = 0.7;
export const createXAxisConfig = (): AxisConfig<number> => {
  const now = new Date();
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    maxPointPerViewport: X_AXIS_MAX_POINT_PER_VIEWPORT,
    totalPoint: X_AXIS_TOTAL_POINTS,
    startValue: nextMonthStart.getTime(),
    get gap() {
      return PLOT_AREA.width / (this.maxPointPerViewport ?? 1 - 1);
    },
    getValueByTick: (index) => {
      const date = new Date(createXAxisConfig().startValue);
      date.setMonth(date.getMonth() - index);
      return date.getTime();
    },
    getCoordByValue: (value) => mapDateToXAxis(value, createXAxisConfig()),
    getLabel: (value) => getMonthName(new Date(value)),
  };
};

export const convertValueToScrollLeft = (value: number, actualWidth: number, logicalTotalWidth: LogicalTotalWidth, xAxisConfig: AxisConfig<number>): number => {
  if (typeof value !== "number") throw new Error("Value must be a number");
  const x = xAxisConfig.getCoordByValue(value);
  return (x / logicalTotalWidth.value) * actualWidth;
};

export const createPoints = (events: CalenderEvent[], target: TargetType, xAxisConfig: AxisConfig<number>, yAxisConfig: AxisConfig<number>): Point[] => {
  if (target === "bedtime") {
    return mapEventsBedtimeToPoint(events, xAxisConfig, yAxisConfig);
  } else if (target === "wakeuptime") {
    return mapEventsWakeUpTimeToPoint(events, xAxisConfig, yAxisConfig);
  } else if (target === "mood") {
    return mapEventsMoodToPoint(events, xAxisConfig, yAxisConfig);
  }
  throw new Error(`Unknown target type: ${target}`);
};

export const getGraphColor = (target: TargetType): string => {
  if (target === "bedtime") {
    return BEDTIME_COLOR;
  } else if (target === "wakeuptime") {
    return WAKEUP_COLOR;
  }
  return MOOD_COLOR;
};

export const getGraphTooltipContent = (target: TargetType, event: CalenderEvent): string => {
  if (target === "bedtime") {
    return `Sleep: ${event.bedTime}`;
  } else if (target === "wakeuptime") {
    return `Wake: ${event.wakeUpTime}`;
  } else if (target === "mood") {
    return `Mood: ${calculateMoodScore(event.mood) | 0}`;
  }
  return "";
};

export type Tick = {
  x: number;
  y: number;
  value: number;
  label: string;
};
