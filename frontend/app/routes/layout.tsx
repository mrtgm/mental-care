import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Header } from "@/components/header";
import { Calender } from "@/features/calender/components/calender";
import { WEEK_COUNT_TO_LOAD } from "@/features/calender/domains/events/constants";
import { type CalenderEvent, type GridDay, generateWeekId } from "@/features/calender/domains/events/domain";
import { EventDetialEditor } from "@/features/event/components/editor";
import { useStore } from "@/store";

export default function Layout() {
  const navigate = useNavigate();

  const calenderStore = useStore.useSlice.calender();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDayClick = useCallback(
    (day: GridDay, event: CalenderEvent | undefined) => {
      if (day.dateObj > new Date()) return; // 未来の日付はクリック不可

      if (event === undefined) {
        setIsDrawerOpen(true);
      } else {
        // イベント詳細へ遷移
        navigate(`/days/${event.id}`);
      }
    },
    [navigate],
  );

  const handleWeekClick = useCallback(
    (week: GridDay[]) => {
      navigate(`/weeks/${generateWeekId(week[6].dateObj, week[0].dateObj)}`);
    },
    [navigate],
  );

  const handleLoadEvents = useCallback(async () => {
    calenderStore.incrementCount();
  }, [calenderStore]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 min-h-screen sm:max-w-full">
      <Header />
      <div className="rounded-2xl border-gray-200 relative">
        <div className="absolute h-full left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#06101a] to-transparent pointer-events-none z-10" />
        <Calender weekCountToLoad={WEEK_COUNT_TO_LOAD} events={calenderStore.events} count={calenderStore.count} onLoadMoreEvents={handleLoadEvents} onDayClick={handleDayClick} onWeekClick={handleWeekClick} />
      </div>

      <Outlet />

      <EventDetialEditor isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </div>
  );
}
