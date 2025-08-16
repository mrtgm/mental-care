import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { convertTimeToMs, getMsFromMonthEnd, getMsOfMonth } from "@/utils/date";
import { floorToPrecision } from "@/utils/math";
import { PLOT_AREA } from "../constants";
import { XPane } from "./x-pane";
import { YPane } from "./y-pane";

export type AxisConfig<T> = {
  maxPointPerViewport?: number;
  totalPoint: number;
  startValue: T;
  mapFn: (value: T) => number;
  gapValueFn: (value: T, index: number) => T;
  fmtFn: (value: T) => string;
};

const YAxisConfig: AxisConfig<number> = {
  totalPoint: 12,
  startValue: convertTimeToMs("5:00"), // 5:00を基準にする
  gapValueFn: (v, index) => v + index * 60 * 60 * 1000 * 2, // 2時間ごとに増加
  mapFn: (value) => {
    const maxValue = YAxisConfig.gapValueFn(YAxisConfig.startValue, YAxisConfig.totalPoint - 1);
    const range = maxValue - YAxisConfig.startValue;

    // 下から上に向かう場合
    const y = ((maxValue - value) / range) * PLOT_AREA.height;
    return y;
  },
  fmtFn: (value) => `${Math.floor(value / (60 * 60 * 1000))}:${String((value / (60 * 1000)) % 60).padStart(2, "0")}`, // 時間:分形式に変換
};

const XAxisConfig: AxisConfig<number> = {
  maxPointPerViewport: 5,
  totalPoint: 10,
  startValue: Date.now(),
  gapValueFn: (v, index) => {
    const date = new Date(v);
    date.setMonth(date.getMonth() - index);
    return date.getTime();
  },
  mapFn: (value) => {
    if (typeof value !== "number") throw new Error("Value must be a number");

    const date = new Date(value);
    date.setHours(0, 0, 0, 0); // 時間を0に設定して日付のみを考慮

    const startDate = new Date(XAxisConfig.startValue);
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
    const x = (index - 1) * XAxisGap + floorToPrecision(getMsFromMonthEnd(date) / getMsOfMonth(date), 100) * XAxisGap;

    // 全体の幅から引く
    return XAxisGap * (XAxisConfig.totalPoint - 1) - x;
  },
  fmtFn: (value) => {
    const date = new Date(value);
    return `${date.getMonth() + 1}月`;
  },
};

// Gap の扱いどうしよっかなあ〜
const XAxisGap = PLOT_AREA.width / (XAxisConfig.maxPointPerViewport ?? 1 - 1);
const YAxisGap = PLOT_AREA.height / (YAxisConfig.totalPoint - 1);

export const Graph = ({ events }: { events: CalenderEvent[] }) => {
  return (
    <div className="w-dvw relative">
      <div className="w-full overflow-x-scroll">
        <XPane events={events} xAxisConfig={XAxisConfig} yAxisConfig={YAxisConfig} />
      </div>

      <div className="absolute top-0 left-0 w-full pointer-events-none">
        <YPane yAxisConfig={YAxisConfig} />
      </div>
    </div>
  );
};
