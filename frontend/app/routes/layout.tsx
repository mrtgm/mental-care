import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Header } from "@/components/header";
import { sampleEvents } from "@/data/dummy-events";
import { sampleWeekEvents } from "@/data/dummy-week-events";
import { Calender } from "@/features/calender/components/calender";
import { CalenderFooter } from "@/features/calender/components/calender-footer";
import { WEEK_COUNT_TO_LOAD } from "@/features/calender/domains/events/constants";
import {
	type CalenderEvent,
	calcCalenderEventMap,
	calcGrid,
	type GridDay,
	generateWeekId,
} from "@/features/calender/domains/events/domain";
import { EventDetial } from "@/features/event/components/detail";
import { EventDetialEditor } from "@/features/event/components/editor";
import { useStore } from "@/store";

export default function Layout() {
	const navigate = useNavigate();

	const calenderStore = useStore.useSlice.calender();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		handleLoadEvents();
	}, []);

	const handleDayClick = useCallback(
		(day: GridDay, event: CalenderEvent | undefined) => {
			if (day.dateObj > new Date()) return; // 未来の日付はクリック不可

			calenderStore.setSelectedGridDay({
				day,
				event,
			});

			if (event === undefined) {
				setIsDrawerOpen(true);
			} else {
				// イベント詳細へ遷移
				navigate(`/days/${event.id}`);
			}
		},
		[navigate, calenderStore],
	);

	const handleWeekClick = useCallback((week: GridDay[]) => {
		navigate(`/weeks/${generateWeekId(week[6].dateObj, week[0].dateObj)}`);
	}, []);

	const handleLoadEvents = useCallback(async () => {
		const { calenderGrid: newCalenderGrid, startDate: updatedStartDate } =
			calcGrid(calenderStore.startDate, WEEK_COUNT_TO_LOAD);
		const calenderEventMap = calcCalenderEventMap(sampleEvents);

		calenderStore.setEvents(sampleEvents);
		calenderStore.setWeekEvents(sampleWeekEvents);
		calenderStore.setEventMap(calenderEventMap);
		calenderStore.setCalenderGrid([
			...calenderStore.calenderGrid,
			...newCalenderGrid,
		]);
		calenderStore.setStartDate(updatedStartDate);
	}, [calenderStore]);

	return (
		<div className="w-full max-w-7xl mx-auto px-6 py-8 bg-white min-h-screen sm:max-w-full">
			<Header />
			<div className="bg-white rounded-2xl border-gray-200 p-6 relative mb-8 sm:px-0">
				<div className="absolute left-0 top-0 bottom-0 w-32 h-72 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
				<Calender
					onLoadMoreEvents={handleLoadEvents}
					onDayClick={handleDayClick}
					onWeekClick={handleWeekClick}
				/>
				<CalenderFooter />
			</div>

			<Outlet />

			<EventDetial />
			<EventDetialEditor
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
			/>
		</div>
	);
}
