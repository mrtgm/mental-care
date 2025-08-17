import * as z from "zod";
import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { convertTimeToMs, formatDate, getMsFromMonthEnd, getMsOfMonth } from "@/utils/date";
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

export const mapEventsBedtimeToPoint = (events: CalenderEvent[], xAxisConfig: AxisConfig<number>, yAxisConfig: AxisConfig<number>): Point[] => {
  return events.map((event) => {
    const x = xAxisConfig.getCoordByValue(new Date(event.year, event.month - 1, event.date).getTime());
    const ms = convertTimeToMs(event.bedTime);
    // 午前時間の場合は24時間を加算
    // この辺、バックエンドで返す値を統一したほうがいい　フロントエンドにあんまロジック入れたくない
    const actualBedTimeMs = ms < 12 * 60 * 60 * 1000 ? 24 * 60 * 60 * 1000 + ms : ms;
    const y = yAxisConfig.getCoordByValue(actualBedTimeMs);
    return { x, y };
  });
};

export const mapEventsWakeUpTimeToPoint = (events: CalenderEvent[], xAxisConfig: AxisConfig<number>, yAxisConfig: AxisConfig<number>): Point[] => {
  return events.map((event) => {
    const x = xAxisConfig.getCoordByValue(new Date(event.year, event.month - 1, event.date).getTime());
    const ms = convertTimeToMs(event.wakeUpTime);
    const y = yAxisConfig.getCoordByValue(ms);
    return { x, y };
  });
};

export type Tick = {
  x: number;
  y: number;
  value: number;
  label: string;
};
