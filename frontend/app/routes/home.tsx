import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/shadcn/button";

import { sampleEvents } from "@/data/dummy-events";
import { Calender } from "@/features/calender/components/calender";
import { CalenderFooter } from "@/features/calender/components/calender-footer";
import { WEEK_COUNT_TO_LOAD } from "@/features/calender/domains/events/constants";
import {
	type CalenderEvent,
	type CalenderEventContent,
	type CalenderEventMap,
	type CalenderGrid,
	calcCalenderEventMap,
	calcGrid,
	type GridDay,
} from "@/features/calender/domains/events/domain";
import { EventDetial } from "@/features/event/components/detail";
import { EventDetialEditor } from "@/features/event/components/editor";
import { useStore } from "@/store";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
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
			setIsDrawerOpen(true);
		},
		[],
	);

	const handleLoadEvents = useCallback(async () => {
		const { calenderGrid: newCalenderGrid, startDate: updatedStartDate } =
			calcGrid(calenderStore.startDate, WEEK_COUNT_TO_LOAD);

		const calenderEventMap = calcCalenderEventMap(sampleEvents); // ここは実際には API から取得する

		calenderStore.setEvents(sampleEvents); // ここは実際には API から取得する
		calenderStore.setEventMap(calenderEventMap);
		calenderStore.setCalenderGrid([
			...calenderStore.calenderGrid,
			...newCalenderGrid,
		]);

		calenderStore.setStartDate(updatedStartDate);
	}, [calenderStore]);

	return (
		<div className="w-full max-w-7xl mx-auto px-6 py-8 bg-white min-h-screen">
			<Header />

			<div className="bg-white rounded-2xl border-gray-200 p-6 relative mb-8">
				<div className="absolute left-0 top-0 bottom-0 w-32 h-72 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

				<Calender
					onLoadMoreEvents={handleLoadEvents}
					onDayClick={handleDayClick}
				/>

				<CalenderFooter />
			</div>

			<EventDetial />

			<EventDetialEditor
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
			/>
		</div>
	);
}
