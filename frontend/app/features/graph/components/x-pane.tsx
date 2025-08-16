import { useEffect, useId, useMemo, useState } from "react";
import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { convertTimeToMs } from "@/utils/date";
import { PLOT_AREA } from "../constants";
import type { AxisConfig } from "./graph";

const mapEventsBedtimeToPoint = (events: CalenderEvent[], xAxisConfig: AxisConfig<number>, yAxisConfig: AxisConfig<number>) => {
  return events.map((event) => {
    const x = xAxisConfig.mapFn(new Date(event.year, event.month - 1, event.date).getTime());
    const ms = convertTimeToMs(event.bedTime);
    // 午前時間の場合は24時間を加算
    const actualBedTimeMs = ms < 12 * 60 * 60 * 1000 ? 24 * 60 * 60 * 1000 + ms : ms;
    const y = yAxisConfig.mapFn(actualBedTimeMs);
    return { x, y };
  });
};

// ポイントの配列からベジェ曲線のパスを生成
const generatePath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  if (sortedPoints.length === 2) {
    return `M ${sortedPoints[0].x},${sortedPoints[0].y} L ${sortedPoints[1].x},${sortedPoints[1].y}`;
  }

  // なるべく平滑にする
  let path = `M ${sortedPoints[0].x},${sortedPoints[0].y}`;

  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const p1 = sortedPoints[i];
    const p2 = sortedPoints[i + 1];

    // X座標の差分（必ず正）
    const dx = p2.x - p1.x;

    // 制御点は開始点と終了点の間に配置（単調性を保証）
    // 制御点1: 開始点から右へ1/3の位置
    const c1x = p1.x + dx * 0.4;
    const c1y = p1.y;

    // 制御点2: 終了点から左へ1/3の位置
    const c2x = p2.x - dx * 0.4;
    const c2y = p2.y;

    // 三次ベジェ曲線で接続
    path += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }

  return path;
};

export const XPane = ({ events, xAxisConfig, yAxisConfig }: { events: CalenderEvent[]; xAxisConfig: AxisConfig<number>; yAxisConfig: AxisConfig<number> }) => {
  const xAxisGap = PLOT_AREA.width / (xAxisConfig.maxPointPerViewport ?? 1 - 1);
  const yAxisGap = PLOT_AREA.height / (yAxisConfig.totalPoint - 1);

  // 全体の縮尺をどっかで打ち止めにしたい、みたいなケースがあるので、これを上に持ってきてどうにかする
  const maxLogicalWidth = useMemo(() => xAxisGap * (xAxisConfig.totalPoint - 1) + PLOT_AREA.marginLeft + PLOT_AREA.marginRight, [xAxisGap, xAxisConfig.totalPoint]);
  const [actualWidth, setActualWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const ratio = window.innerWidth / PLOT_AREA.totalWidth;
      setActualWidth(maxLogicalWidth * ratio);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [maxLogicalWidth]);

  const data = mapEventsBedtimeToPoint(events, xAxisConfig, yAxisConfig);
  return (
    <div className="w-full overflow-x-scroll">
      <svg viewBox={`0 0 ${maxLogicalWidth} ${PLOT_AREA.totalHeight}`} xmlns="http://www.w3.org/2000/svg" style={{ width: actualWidth }}>
        <title>Graph-X</title>

        <Grid xAxisGap={xAxisGap} yAxisGap={yAxisGap} maxLogicalWidth={maxLogicalWidth} />

        <XAxisTicks xAxisGap={xAxisGap} xAxisConfig={xAxisConfig} maxLogicalWidth={maxLogicalWidth} />

        <g transform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
          {data.map((point) => (
            <circle key={`${point.x}_${point.y}`} cx={point.x} cy={point.y} r="4" fill="#007bff" />
          ))}

          <path d={generatePath(data)} fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

const Grid = ({ xAxisGap, yAxisGap, maxLogicalWidth }: { xAxisGap: number; yAxisGap: number; maxLogicalWidth: number }) => {
  const id = useId();

  return (
    <>
      <defs>
        <pattern id={id} width={xAxisGap} height={yAxisGap} patternUnits="userSpaceOnUse" patternTransform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
          <path d={`M ${xAxisGap} 0 L 0 0 0 ${yAxisGap}`} fill="none" stroke="#e9ecef" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x={PLOT_AREA.marginLeft} y={PLOT_AREA.marginTop} width={maxLogicalWidth - PLOT_AREA.marginLeft} height={PLOT_AREA.height} fill={`url(#${id})`} />
    </>
  );
};

const XAxisTicks = ({ xAxisGap, xAxisConfig, maxLogicalWidth }: { xAxisGap: number; xAxisConfig: AxisConfig<number>; maxLogicalWidth: number }) => {
  const xAxisTicks = Array.from({ length: xAxisConfig.totalPoint }, (_, index) => {
    const value = xAxisConfig.gapValueFn(xAxisConfig.startValue, index);
    const x = xAxisGap * (xAxisConfig.totalPoint - index - 1); // X座標は右から左に増加するため、逆順に計算
    const y = PLOT_AREA.height;

    return {
      x,
      y,
      value,
      formattedValue: xAxisConfig.fmtFn(value),
    };
  });

  return (
    <g transform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
      <line x1="0" y1={PLOT_AREA.height} x2={maxLogicalWidth - PLOT_AREA.marginLeft} y2={PLOT_AREA.height} stroke="#333" strokeWidth="1" />

      {xAxisTicks.map((v) => {
        return (
          <g key={v.value} transform={`translate(${v.x}, ${v.y})`}>
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#333" strokeWidth="1" />
            <text x="0" y="15" fontFamily="Arial" fontSize="12" fill="#666" textAnchor="middle">
              {v.formattedValue}
            </text>
          </g>
        );
      })}
    </g>
  );
};
