import { useCallback } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { Header } from "@/components/header";
import { Calender } from "@/features/calender/components/calender";
import { WEEK_COUNT_TO_LOAD } from "@/features/calender/domains/events/constants";
import type { Achievement, CalenderEvent, GridDay } from "@/features/calender/domains/events/domain";
import { useStore } from "@/store";
import { groupBy } from "@/utils/function";
import { achievementsMaster } from "../data/dummy-achievements"; // Assuming you have a data file with sample achievements
import type { Route } from "./+types/day";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Achievements - ${params.dayId}` }, { name: "description", content: `${params.dayId}の日表示` }];
}

export default function Achievements() {
  const achievementsByType = groupBy(achievementsMaster as Achievement[], "type");

  const calenderStore = useStore.useSlice.calender();

  const { id } = useParams();
  const navigate = useNavigate();

  const filteredEvents = id ? calenderStore.events.filter((event) => event.achievements.includes(id)) : calenderStore.events;

  const handleLoadEvents = useCallback(async () => {
    calenderStore.incrementCount();
  }, [calenderStore]);

  const handleDayClick = useCallback(
    (day: GridDay, event: CalenderEvent | undefined) => {
      if (day.dateObj > new Date()) return; // 未来の日付はクリック不可
      if (event === undefined) return;
      navigate(`/days/${event.id}`);
    },
    [navigate],
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 min-h-screen sm:max-w-full">
      <Header />
      <div className="rounded-2xl border-gray-200 relative">
        <div className="absolute h-full left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#06101a] to-transparent pointer-events-none z-10" />
        <Calender events={filteredEvents} weekEvents={[]} count={calenderStore.count} weekCountToLoad={WEEK_COUNT_TO_LOAD} onLoadMoreEvents={handleLoadEvents} onDayClick={handleDayClick} onWeekClick={() => {}} />
      </div>
      <div className="text-white mt-6 pt-6 border-t-1 border-gray-200">
        <div className="flex items-start gap-20 mb-4">
          <div>
            <h2 className="text-xl font-bold mb-4">positive</h2>

            <ul className="list-disc pl-6 mb-8 text-gray-500 text-sm">
              {achievementsByType.positive
                ?.sort((a, b) => b.score - a.score)
                .map((achievement) => (
                  <li key={achievement.id} className="mb-2">
                    <NavLink to={`/achievements/${achievement.id}`} className={({ isActive }) => (isActive ? "underline text-white" : "")}>
                      <span className="font-semibold">{achievement.label}</span>
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">negative</h2>

            <ul className="list-disc pl-6 text-gray-500 text-sm">
              {achievementsByType.negative
                ?.sort((a, b) => b.score - a.score)
                .map((achievement) => (
                  <li key={achievement.id} className="mb-2">
                    <NavLink to={`/achievements/${achievement.id}`} className={({ isActive }) => (isActive ? "underline text-white" : "")}>
                      <span className="font-semibold">{achievement.label}</span>
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
