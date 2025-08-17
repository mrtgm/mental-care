import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { formatDate, getMonthName } from "@/utils/date";
import { type CalenderEvent, type CalenderWeekEvent, calcCalenderEventMap, calcGrid, type GridDay, generateWeekId, getCalendarDateStyles, getMoodBasedColors } from "../domains/events/domain";
import { CalendarTooltip } from "./tooltip";

export const Calender = ({
  events,
  weekEvents,
  selectedDate = formatDate(new Date()),
  count,
  weekCountToLoad,
  onDayClick,
  onWeekClick,
  onLoadMoreEvents,
}: {
  events: CalenderEvent[];
  weekEvents: CalenderWeekEvent[];
  selectedDate?: string | undefined;
  count: number;
  weekCountToLoad: number;
  onLoadMoreEvents: () => Promise<void>;
  onDayClick: (day: GridDay, content: CalenderEvent | undefined) => void;
  onWeekClick: (week: GridDay[]) => void;
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const calenderGrid = useMemo(() => {
    return calcGrid(count, weekCountToLoad);
  }, [count, weekCountToLoad]);

  const calenderEventMap = useMemo(() => {
    return calcCalenderEventMap(events);
  }, [events]);

  const observerDomRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              await onLoadMoreEvents();
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        },
      );

      if (!node) return;
      observerRef.current.observe(node);
    },
    [onLoadMoreEvents],
  );

  const calenderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calenderRef.current) {
      const targetDom = document.getElementById(selectedDate);

      console.log("selectedDate", selectedDate);
      console.log("targetDom", targetDom);

      if (targetDom) {
        const scrollLeft = targetDom.getBoundingClientRect().left - calenderRef.current.getBoundingClientRect().left;
        console.log("scrollLeft", scrollLeft);
        calenderRef.current.scrollLeft = scrollLeft;
      }
    }
  }, [selectedDate]);

  return (
    <div ref={calenderRef} className="mt-2 w-full overflow-x-scroll overflow-y-visible flex flex-row-reverse relative gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <AnimatePresence>
        {calenderGrid.map((week, rowIndex, self) => {
          const totalLength = self.length;
          const weekEvent = weekEvents.find((v) => v.id === generateWeekId(week[6].dateObj, week[0].dateObj));

          return (
            <CalanderWeek
              key={`${week[0].dateString}`}
              week={week}
              weekEvent={weekEvent}
              rowIndex={rowIndex}
              totalLength={totalLength}
              onDayClick={onDayClick}
              onWeekClick={onWeekClick}
              observerDomRef={observerDomRef}
              calenderEventMap={calenderEventMap}
              selectedDate={selectedDate}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const CalanderWeek = ({
  week,
  weekEvent,
  rowIndex,
  totalLength,
  calenderEventMap,
  selectedDate,
  onDayClick,
  onWeekClick,
  observerDomRef,
}: {
  week: GridDay[];
  weekEvent?: CalenderWeekEvent;
  rowIndex: number;
  totalLength: number;
  calenderEventMap: Map<string, CalenderEvent>;
  selectedDate?: string;
  onDayClick: (day: GridDay, content: CalenderEvent | undefined) => void;
  onWeekClick: (week: GridDay[]) => void;
  observerDomRef: (node: HTMLElement | null) => void;
}) => {
  const isFirstWeekOfMonth = week.some((v) => v.date === 1);
  const isFirstWeekOfYear = isFirstWeekOfMonth && week.some((v) => v.month === 1) && !week.some((v) => v.month === 2);

  const isObserved = rowIndex + 5 === totalLength;
  const hasWeekEvent = !!weekEvent;
  const [isHoverOnHeader, setIsHoverOnHeader] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ opacity: 0, y: -20 }}
      key={rowIndex}
      className="flex-shrink-0 w-6 h-full flex flex-col"
      {...(isObserved && { ref: observerDomRef })}
    >
      <button type="button" className="h-[40px] flex items-center justify-center mb-3 cursor-pointer" onMouseEnter={() => setIsHoverOnHeader(true)} onMouseLeave={() => setIsHoverOnHeader(false)} onClick={() => onWeekClick(week)}>
        {isFirstWeekOfYear && <span className="absolute top-0 text-xs text-white">{week.at(0)?.year ?? 0}</span>}
        {hasWeekEvent ? (
          <span className="w-6 h-6 absolute top-[21px]" style={{ background: getMoodBasedColors(20).backgroundColor }} />
        ) : (
          <AnimatePresence>
            {isHoverOnHeader && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-6 h-6 absolute top-[21px]" style={{ backgroundColor: getMoodBasedColors(20).backgroundColor }}></motion.span>}
          </AnimatePresence>
        )}
        {isFirstWeekOfMonth && <span className="absolute top-[26px] text-xs text-white">{getMonthName(week.at(0)?.dateObj)}</span>}
      </button>

      <div className="flex-1 flex flex-col gap-2">
        <TooltipProvider>
          {week.map((day, columnIndex) => {
            const event = calenderEventMap.get(`${rowIndex}:${columnIndex}`);
            const isSelectedDate = selectedDate === day.dateString;
            return <CalenderDate key={day.dateString} event={event} day={day} columnIndex={columnIndex} onDayClick={onDayClick} isSelectedDate={isSelectedDate} />;
          })}
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

const CalenderDate = ({
  day,
  columnIndex,
  event,
  isSelectedDate,
  onDayClick,
}: {
  day: GridDay;
  columnIndex: number;
  event: CalenderEvent | undefined;
  isSelectedDate: boolean;
  onDayClick: (day: GridDay, content: CalenderEvent | undefined) => void;
}) => {
  const isFutureDate = day.dateObj > new Date();
  const isCurrentDate = day.dateObj.toDateString() === new Date().toDateString();

  const className = getCalendarDateStyles(event, isCurrentDate, isFutureDate, isSelectedDate);

  return (
    <Tooltip key={day.dateString}>
      <TooltipTrigger asChild>
        <button id={day.dateString} type="button" className={className.className} data-score={className.moodScore} style={{ order: 7 - columnIndex, ...className.style }} onClick={() => onDayClick(day, event)} />
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-[#06101a] rounded-none text-white">
        <CalendarTooltip day={day} event={event} />
      </TooltipContent>
    </Tooltip>
  );
};
