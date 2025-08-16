import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { data, useParams } from "react-router";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Header } from "@/components/header";
import { sampleEvents } from "@/data/dummy-events";
import type { Route } from "./+types/week";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Sleeping Time` }];
}

const plotArea = {
  marginTop: 10,
  marginLeft: 40,
  marginRight: 20,
  marginBottom: 40,
  width: 400,
  height: 200,

  get totalWidth() {
    return this.marginLeft + this.width;
  },
  get totalHeight() {
    return this.marginTop + this.height + this.marginBottom;
  },
};

type AxisConfig<T> = {
  maxPointPerViewport?: number;
  totalPoint: number;
  startValue: T;
  mapFn: (value: T) => number;
  gapValueFn: (value: T, index: number) => T;
  fmtFn: (value: T) => string;
};

const convertTimeToMs = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes) * 60 * 1000; // ミリ秒に変換
};

const YAxisConfig: AxisConfig<number> = {
  totalPoint: 12,

  startValue: convertTimeToMs("5:00"), // 5:00を基準にする
  gapValueFn: (v, index) => v + index * 60 * 60 * 1000 * 2, // 2時間ごとに増加
  mapFn: (value) => {
    const maxValue = YAxisConfig.gapValueFn(YAxisConfig.startValue, YAxisConfig.totalPoint - 1);
    const range = maxValue - YAxisConfig.startValue;

    // 下から上に向かう場合
    const y = ((maxValue - value) / range) * plotArea.height;
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
    const startDate = new Date(XAxisConfig.startValue);
    if (date.getTime() > startDate.getTime()) throw new Error("Date cannot be in the future");

    // 月の開始日を基準にして、X座標を計算
    let index = 0;
    while (date.getTime() < startDate.getTime()) {
      startDate.setMonth(startDate.getMonth() - 1);
      index++;
    }

    const getMsOfMonth = (date: Date) => {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return nextMonth.getDate() * 24 * 60 * 60 * 1000;
    };

    // 月の開始日からの差分を計算
    const diffMs = startDate.getTime() - date.getTime();
    // 行き過ぎた分を計算してX座標を調整
    const x = index * XAxisGap + (diffMs / getMsOfMonth(startDate)) * XAxisGap;

    // 全体の幅から引く
    return XAxisGap * (XAxisConfig.totalPoint - 1) - x;
  },
  fmtFn: (value) => {
    const date = new Date(value);
    return `${date.getMonth() + 1}月`;
  },
};

const XAxisGap = plotArea.width / (XAxisConfig.maxPointPerViewport ?? 1 - 1);
const YAxisGap = plotArea.height / (YAxisConfig.totalPoint - 1);
const maxLogicalWidth = XAxisGap * (XAxisConfig.totalPoint - 1) + plotArea.marginLeft + plotArea.marginRight;

const ContainerSample = () => {
  const id = useId();

  const ratio = window.innerWidth / plotArea.totalWidth;
  const actualWidth = maxLogicalWidth * ratio;

  const XAxisTicks = Array.from({ length: XAxisConfig.totalPoint }, (_, index) => {
    const value = XAxisConfig.gapValueFn(XAxisConfig.startValue, index);

    const x: number = XAxisGap * (XAxisConfig.totalPoint - index - 1);
    const y = plotArea.height;

    return {
      x,
      y,
      value,
      formattedValue: XAxisConfig.fmtFn(value),
    };
  });

  const YAxisTicks = Array.from({ length: YAxisConfig.totalPoint }, (_, index) => {
    const value = YAxisConfig.gapValueFn(YAxisConfig.startValue, index);
    const y = plotArea.height - YAxisGap * index;
    return {
      x: 0,
      y,
      value,
      formattedValue: YAxisConfig.fmtFn(value),
    };
  });

  const data = [
    {
      date: "2025-01-01",
      value: "9:00",
    },
    {
      date: "2025-8-02",
      value: "8:30",
    },
  ].map((event) => {
    return {
      x: XAxisConfig.mapFn(new Date(event.date).getTime()),
      y: YAxisConfig.mapFn(convertTimeToMs(event.value)),
    };
  });

  const generatePath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

    const sortedPoints = [...points].sort((a, b) => a.x - b.x);

    let path = `M ${sortedPoints[0].x},${sortedPoints[0].y}`;

    if (sortedPoints.length === 2) {
      // 2点の場合は直線
      path += ` L ${sortedPoints[1].x},${sortedPoints[1].y}`;
    } else {
      const firstPoint = sortedPoints[0];
      const secondPoint = sortedPoints[1];

      // コントロールポイントを計算（2点目の少し手前）
      const controlX = firstPoint.x + (secondPoint.x - firstPoint.x) * 0.75;
      const controlY = firstPoint.y + (secondPoint.y - firstPoint.y) * 0.75;

      path += ` Q ${controlX},${controlY} ${secondPoint.x},${secondPoint.y}`;

      // 残りの点は T コマンドで繋ぐ
      for (let i = 2; i < sortedPoints.length; i++) {
        path += ` T ${sortedPoints[i].x},${sortedPoints[i].y}`;
      }
    }

    return path;
  };

  return (
    <div className="w-dvw relative h-auto">
      <div className="w-full overflow-x-scroll">
        <svg viewBox={`0 0 ${maxLogicalWidth} ${plotArea.totalHeight}`} xmlns="http://www.w3.org/2000/svg" style={{ width: actualWidth }}>
          <title>Graph-X</title>

          <defs>
            <pattern id={id} width={XAxisGap} height={YAxisGap} patternUnits="userSpaceOnUse">
              <path d={`M ${XAxisGap} 0 L 0 0 0 ${YAxisGap}`} fill="none" stroke="#e9ecef" strokeWidth="1" />
            </pattern>
          </defs>

          <g transform={`translate(${plotArea.marginLeft}, ${plotArea.marginTop})`}>
            <rect x="0" y="0" width={maxLogicalWidth - plotArea.marginLeft} height={plotArea.height} fill={`url(#${id})`} />
            <line x1="0" y1={plotArea.height} x2={maxLogicalWidth - plotArea.marginLeft} y2={plotArea.height} stroke="#333" strokeWidth="1" />

            {XAxisTicks.map((v) => {
              return (
                <g key={v.value} transform={`translate(${v.x}, ${v.y})`}>
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#333" strokeWidth="1" />
                  <text x="0" y="15" fontFamily="Arial" fontSize="12" fill="#666" textAnchor="middle">
                    {XAxisConfig.fmtFn(v.value)}
                  </text>
                </g>
              );
            })}
          </g>

          <g transform={`translate(${plotArea.marginLeft}, ${plotArea.marginTop})`}>
            {data.map((point) => (
              <circle key={`${point.x}_${point.y}`} cx={point.x} cy={point.y} r="4" fill="#007bff" />
            ))}

            <path d={generatePath(data)} fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <svg viewBox={`0 0 ${plotArea.totalWidth} ${plotArea.totalHeight}`} xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full pointer-events-none">
        <title>Graph-Y</title>

        <rect x="0" y="0" width={plotArea.marginLeft} height={plotArea.marginTop + plotArea.height + 2} fill="#fff" />

        <g transform={`translate(${plotArea.marginLeft}, ${plotArea.marginTop})`}>
          <line x1="0" y1="0" x2="0" y2={plotArea.height} stroke="#333" strokeWidth="1" />

          {YAxisTicks.map((v) => {
            return (
              <g key={v.value} transform={`translate(0, ${v.y})`}>
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#333" strokeWidth="1" />
                <text x="-10" y="5" fontFamily="Arial" fontSize="12" fill="#666" textAnchor="end">
                  {YAxisConfig.fmtFn(v.value)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default function SleepingTime() {
  const { weekId } = useParams();

  return (
    <div className="w-full max-w-7xl mx-auto bg-white min-h-screen sm:max-w-full">
      <div className="px-6 py-8">
        <Header />
      </div>
      <div className="bg-white rounded-2xl border-gray-200 p-6 relative mb-8 sm:px-0">
        <div className="absolute left-0 top-0 bottom-0 w-full h-72">
          <pre>
            {JSON.stringify(sampleEvents, null, 2)}

            <ContainerSample />
          </pre>
        </div>
      </div>
    </div>
  );
}
