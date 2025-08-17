import { useCallback } from "react";
import { Link, NavLink, useParams } from "react-router";
import { Header } from "@/components/header";
import { sampleEvents } from "@/data/dummy-events";
import { sampleWeekEvents } from "@/data/dummy-week-events";
import { Calender } from "@/features/calender/components/calender";
import { WEEK_COUNT_TO_LOAD } from "@/features/calender/domains/events/constants";
import { type Achievement, calcCalenderEventMap, calcGrid } from "@/features/calender/domains/events/domain";
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

  const filteredEvents = id ? calenderStore.events.filter((event) => event.achievements.includes(id)) : calenderStore.events;

  const handleLoadEvents = useCallback(async () => {
    calenderStore.incrementCount();
  }, [calenderStore]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 min-h-screen sm:max-w-full">
      <Header />
      <div className="rounded-2xl border-gray-200 relative">
        <div className="absolute h-full left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#06101a] to-transparent pointer-events-none z-10" />
        <Calender events={filteredEvents} count={calenderStore.count} weekCountToLoad={WEEK_COUNT_TO_LOAD} onLoadMoreEvents={handleLoadEvents} onDayClick={() => {}} onWeekClick={() => {}} />
      </div>
      <div className="text-white mt-6 pt-6 border-t-1 border-gray-200">
        <div className="flex items-start gap-20 mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-4">Positive</h2>

            <ul className="list-disc pl-6 mb-8 text-gray-500">
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
            <h2 className="text-2xl font-bold mb-4">Negative</h2>

            <ul className="list-disc pl-6 text-gray-500">
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
