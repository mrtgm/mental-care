import { MAX_HEIGHT, PLOT_AREA } from "../constants";
import type { AxisConfig } from "../domain";

export const YPane = ({ yAxisConfig }: { yAxisConfig: AxisConfig<number> }) => {
  const yAxisGap = PLOT_AREA.height / (yAxisConfig.totalPoint - 1);

  const yAxisTicks = Array.from({ length: yAxisConfig.totalPoint }, (_, index) => {
    const value = yAxisConfig.getValueByTick(index);
    const y = PLOT_AREA.height - yAxisGap * index;
    return {
      x: 0,
      y,
      value,
      formattedValue: yAxisConfig.getLabel(value),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${PLOT_AREA.totalWidth} ${PLOT_AREA.totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        maxHeight: MAX_HEIGHT,
      }}
    >
      <title>Graph-Y</title>

      <rect x="0" y="0" width={PLOT_AREA.marginLeft} height={PLOT_AREA.marginTop + PLOT_AREA.height + 20} fill="#fff" />

      <g transform={`translate(${PLOT_AREA.marginLeft}, ${PLOT_AREA.marginTop})`}>
        <line x1="0" y1="0" x2="0" y2={PLOT_AREA.height} stroke="#333" strokeWidth="1" />

        {yAxisTicks.map((v) => {
          return (
            <g key={v.value} transform={`translate(0, ${v.y})`}>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#333" strokeWidth="1" />
              <text x="-8" y="3" fontFamily="Arial" fontSize="8" fill="#666" textAnchor="end">
                {yAxisConfig.getLabel(v.value)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
