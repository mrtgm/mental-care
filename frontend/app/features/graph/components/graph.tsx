import { useCallback, useMemo, useRef, useState } from "react";
import type { SetURLSearchParams } from "react-router";
import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { useResize } from "@/hooks/use-resize";
import { PLOT_AREA } from "../constants";
import { type AxisConfig, createPoints, createXAxisConfig, createYAxisConfig, type TargetType } from "../domain";
import { XPane } from "./x-pane";
import { YPane } from "./y-pane";

const calculateLogicalTotalWidth = (xConfig: AxisConfig<number>) => {
  const withoutMargin = xConfig.gap * (xConfig.totalPoint - 1);
  const withMargin = withoutMargin + PLOT_AREA.marginLeft + PLOT_AREA.marginRight;

  return {
    value: withMargin,
    withoutMargin,
  };
};

export const Graph = ({ events, target, dateString, handleClickDataPoint }: { events: CalenderEvent[]; target: TargetType; dateString: string; handleClickDataPoint: (event: CalenderEvent) => void }) => {
  const yPaneRef = useRef<HTMLDivElement>(null);

  const [actualTotalWidth, setActualTotalWidth] = useState(0);

  const xAxisConfig = useMemo(() => createXAxisConfig(), []);
  const yAxisConfig = useMemo(() => createYAxisConfig(target), [target]);
  const points = useMemo(() => createPoints(events, target, xAxisConfig, yAxisConfig), [events, target, xAxisConfig, yAxisConfig]);
  const logicalTotalWidth = useMemo(() => calculateLogicalTotalWidth(xAxisConfig), [xAxisConfig]);

  const handleResize = useCallback(() => {
    if (!yPaneRef.current) return;
    const ratio = logicalTotalWidth.value / PLOT_AREA.totalHeight;
    setActualTotalWidth(yPaneRef.current.scrollHeight * ratio);
  }, [logicalTotalWidth]);

  useResize(handleResize);

  return (
    <div className="w-full relative">
      <div className="w-full overflow-x-scroll">
        <XPane
          dateString={dateString}
          target={target}
          events={events}
          points={points}
          xAxisConfig={xAxisConfig}
          yAxisConfig={yAxisConfig}
          actualTotalWidth={actualTotalWidth}
          logicalTotalWidth={logicalTotalWidth}
          handleClickDataPoint={handleClickDataPoint}
        />
      </div>

      <div className="absolute top-0 left-0 w-full pointer-events-none" ref={yPaneRef}>
        <YPane yAxisConfig={yAxisConfig} />
      </div>
    </div>
  );
};
