import { useCallback, useMemo, useRef, useState } from "react";
import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { useResize } from "@/hooks/use-resize";
import { convertMsToTime, convertTimeToMs, getMonthName } from "@/utils/date";
import { PLOT_AREA } from "../constants";
import { type AxisConfig, mapDateToXAxis, mapEventsBedtimeToPoint, mapEventsWakeUpTimeToPoint, mapMsToYAxis } from "../domain";
import { XPane } from "./x-pane";
import { YPane } from "./y-pane";

const yAxisConfig: AxisConfig<number> = {
  totalPoint: 7,
  startValue: convertTimeToMs("5:00"), // 5:00を基準にする
  get gap() {
    return PLOT_AREA.height / (yAxisConfig.totalPoint - 1);
  },
  getValueByTick: (index) => yAxisConfig.startValue + index * ((60 * 60 * 1000 * 24) / (yAxisConfig.totalPoint - 1)),
  getCoordByValue: (value) => mapMsToYAxis(value, yAxisConfig),
  getLabel: (value) => convertMsToTime(value),
};

const xAxisConfig: AxisConfig<number> = {
  maxPointPerViewport: 1,
  totalPoint: 12,
  startValue: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime(), // 来月の初日を基準にする
  get gap() {
    return PLOT_AREA.width / (xAxisConfig.maxPointPerViewport ?? 1 - 1);
  },
  getValueByTick: (index) => {
    const date = new Date(xAxisConfig.startValue);
    date.setMonth(date.getMonth() - index);
    return date.getTime();
  },
  getCoordByValue: (value) => mapDateToXAxis(value, xAxisConfig),
  getLabel: (value) => getMonthName(new Date(value)),
};

const logicalTotalWidth = {
  get value() {
    return xAxisConfig.gap * (xAxisConfig.totalPoint - 1) + PLOT_AREA.marginLeft + PLOT_AREA.marginRight;
  },
  get withoutMargin() {
    return xAxisConfig.gap * (xAxisConfig.totalPoint - 1);
  },
};

export const Graph = ({ events, target, dateString }: { events: CalenderEvent[]; target: string; dateString: string }) => {
  const yPaneRef = useRef<HTMLDivElement>(null);

  const [actualTotalWidth, setActualTotalWidth] = useState(0);

  const handleResize = useCallback(() => {
    if (!yPaneRef.current) return;
    const ratio = logicalTotalWidth.value / PLOT_AREA.totalHeight;
    setActualTotalWidth(yPaneRef.current.scrollHeight * ratio);
  }, []);

  useResize(handleResize);

  const points = useMemo(() => {
    if (target === "bedtime") {
      return mapEventsBedtimeToPoint(events, xAxisConfig, yAxisConfig);
    } else {
      return mapEventsWakeUpTimeToPoint(events, xAxisConfig, yAxisConfig);
    }
  }, [events, target]);

  return (
    <div className="w-full relative">
      <div className="w-full overflow-x-scroll">
        <XPane events={events} points={points} xAxisConfig={xAxisConfig} yAxisConfig={yAxisConfig} actualTotalWidth={actualTotalWidth} logicalTotalWidth={logicalTotalWidth} />
      </div>

      <div className="absolute top-0 left-0 w-full pointer-events-none" ref={yPaneRef}>
        <YPane yAxisConfig={yAxisConfig} />
      </div>
    </div>
  );
};
