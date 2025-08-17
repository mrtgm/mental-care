import { MAX_HEIGHT, PLOT_AREA } from "../constants";
import type { AxisConfig, LogicalTotalWidth, Tick } from "../domain";

export const YPane = ({ yAxisConfig }: { yAxisConfig: AxisConfig<number> }) => {
  const yAxisGap = PLOT_AREA.height / (yAxisConfig.totalPoint - 1);

  const yAxisTicks: Tick[] = Array.from({ length: yAxisConfig.totalPoint }, (_, index) => {
    const value = yAxisConfig.getValueByTick(index);
    const y = PLOT_AREA.height - yAxisGap * index;
    const dateObj = new Date(value);
    return {
      x: 0,
      y,
      value,
      label: yAxisConfig.getLabel(value),
      dateObj,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${PLOT_AREA.width} ${PLOT_AREA.totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        maxHeight: MAX_HEIGHT,
        maxWidth: (PLOT_AREA.width / PLOT_AREA.totalHeight) * MAX_HEIGHT,
      }}
    >
      <rect x="0" y="0" width={PLOT_AREA.marginLeft} height={PLOT_AREA.marginTop + PLOT_AREA.height + 20} fill="#06101a" />

      <g transform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
        <line x1="0" y1="0" x2="0" y2={PLOT_AREA.height} stroke="#fff" strokeWidth="1" />

        {yAxisTicks.map((v) => {
          return (
            <g key={v.value} transform={`translate(0, ${v.y})`}>
              <line x1="-3" y1="0.5" x2="3" y2="0.5" stroke="#fff" strokeWidth="1" />
              <text x="-8" y="3" fontSize="10" fill="#fff" textAnchor="end">
                {v.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
