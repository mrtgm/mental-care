import type { Point } from "motion/react";
import { useEffect, useId, useRef } from "react";
import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { PLOT_AREA } from "../constants";
import { type AxisConfig, type LogicalTotalWidth, mapEventsBedtimeToPoint, mapEventsWakeUpTimeToPoint, type Tick } from "../domain";

export const XPane = ({
  events,
  xAxisConfig,
  yAxisConfig,
  actualTotalWidth,
  logicalTotalWidth,
}: {
  events: CalenderEvent[];
  xAxisConfig: AxisConfig<number>;
  yAxisConfig: AxisConfig<number>;
  actualTotalWidth: number;
  logicalTotalWidth: LogicalTotalWidth;
}) => {
  const xPaneRef = useRef<HTMLDivElement>(null);

  const data = mapEventsBedtimeToPoint(events, xAxisConfig, yAxisConfig);
  const wakeUpData = mapEventsWakeUpTimeToPoint(events, xAxisConfig, yAxisConfig);

  useEffect(() => {
    if (xPaneRef.current) {
      xPaneRef.current.scrollLeft = actualTotalWidth;
    }
  }, [actualTotalWidth]);

  return (
    <div className="w-full overflow-x-scroll" ref={xPaneRef}>
      <svg viewBox={`0 0 ${logicalTotalWidth.value} ${PLOT_AREA.totalHeight}`} xmlns="http://www.w3.org/2000/svg" style={{ width: actualTotalWidth }}>
        <title>Graph-X</title>

        <Grid xAxisGap={xAxisConfig.gap} yAxisGap={yAxisConfig.gap} logicalTotalWidth={logicalTotalWidth} />

        <XAxisTicks xAxisConfig={xAxisConfig} logicalTotalWidth={logicalTotalWidth} />

        <DataPoints data={data} stroke="#007bff" />
        <DataPoints data={wakeUpData} stroke="#dc3545" />
      </svg>
    </div>
  );
};

const Grid = ({ xAxisGap, yAxisGap, logicalTotalWidth }: { xAxisGap: number; yAxisGap: number; logicalTotalWidth: LogicalTotalWidth }) => {
  const id = useId();

  return (
    <>
      <defs>
        <pattern id={id} width={xAxisGap} height={yAxisGap} patternUnits="userSpaceOnUse" patternTransform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
          <path d={`M ${xAxisGap} 0 L 0 0 0 ${yAxisGap}`} fill="none" stroke="#3f485a" strokeWidth="2" strokeDasharray="2 2" />
        </pattern>
      </defs>
      <rect x={PLOT_AREA.marginLeft} y={PLOT_AREA.marginTop} width={logicalTotalWidth.value - PLOT_AREA.marginLeft} height={PLOT_AREA.height} fill={`url(#${id})`} />
    </>
  );
};

const XAxisTicks = ({ xAxisConfig, logicalTotalWidth }: { xAxisConfig: AxisConfig<number>; logicalTotalWidth: LogicalTotalWidth }) => {
  const xAxisTicks: Tick[] = Array.from({ length: xAxisConfig.totalPoint }, (_, index) => {
    const value = xAxisConfig.getValueByTick(index);
    const x = logicalTotalWidth.withoutMargin - index * xAxisConfig.gap;
    const y = PLOT_AREA.height;

    return {
      x,
      y,
      value,
      label: xAxisConfig.getLabel(value),
    };
  });

  return (
    <g transform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
      <line x1="0" y1={PLOT_AREA.height + 0.5} x2={logicalTotalWidth.value - PLOT_AREA.marginLeft} y2={PLOT_AREA.height + 0.5} stroke="#fff" strokeWidth="1" />

      {xAxisTicks.map((v) => {
        return (
          <g key={v.value} transform={`translate(${v.x}, ${v.y})`}>
            <line x1="0.5" y1="-3" x2="0.5" y2="3" stroke="#fff" strokeWidth="1" />
            <text x="0" y="15" fontSize="8" fill="#fff" textAnchor="middle">
              {v.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const DataPoints = ({ data, stroke }: { data: Point[]; stroke: string }) => {
  // ポイントの配列からベジェ曲線のパスを生成
  const generatePath = (points: Point[]) => {
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

      const dx = p2.x - p1.x;

      // 制御点は開始点と終了点の間に配置（単調性を保証）
      // 制御点1: 開始点から右へ1/3の位置
      const c1x = p1.x + dx * 0.4;
      const c1y = p1.y;

      // 制御点2: 終了点から左へ1/3の位置
      const c2x = p2.x - dx * 0.4;
      const c2y = p2.y;

      path += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }

    return path;
  };

  return (
    <g transform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
      <path d={generatePath(data)} fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />

      {data.map((point) => (
        <rect key={`${point.x}_${point.y}`} x={point.x - 4} y={point.y - 4} width="8" height="8" fill={stroke} style={{ pointerEvents: "none" }} />
      ))}
    </g>
  );
};
