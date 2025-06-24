import { useCallback, useEffect, useRef, useState } from "react";
import {
	WEEK_COUNT_TO_LOAD,
	WEEK_OFFSET_TO_LOAD,
} from "~/features/calender/domains/events/constants";
import {
	type CalenderEvent,
	type CalenderEventMap,
	type CalenderGrid,
	calcCalenderEventMap,
	calcGrid,
} from "~/features/calender/domains/events/domain";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// type: events
const calenderEvents = [
	{
		year: 2025,
		month: 5,
		date: 1,
		achievements: [],
		content: {
			message: "hooo",
		},
	},
	{
		year: 2025,
		month: 3,
		date: 23,
		achievements: [],
		content: {
			message: "yes",
		},
	},
	{
		year: 2024,
		month: 3,
		date: 23,
		achievements: [],
		content: {
			message: "yes",
		},
	},
];

export default function Home() {
	const ref = useRef<HTMLDivElement>(null);

	const [calenderState, setCalenderState] = useState<{
		calenderEvents: CalenderEvent[];
		calenderEventMap: CalenderEventMap;
		calenderGrid: CalenderGrid;
		startDate: Date;
	}>({
		calenderEvents: [],
		calenderEventMap: new Map(),
		calenderGrid: [],
		startDate: new Date(),
	});

	const observerRef = useCallback(
		(node: HTMLElement | null) => {
			if (!node) return;
			const intersectionObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const {
								calenderGrid: newCalenderGrid,
								startDate: updatedStartDate,
							} = calcGrid(calenderState.startDate, WEEK_COUNT_TO_LOAD);

							// Event の fetch (range) してステート更新が必要
							// loding 中なら無視とか

							const updatedCalenderEventMap = calcCalenderEventMap(
								calenderState.calenderEventMap,
								calenderState.calenderEvents,
							);

							setCalenderState(({ calenderGrid, calenderEvents }) => ({
								calenderEvents,
								calenderEventMap: updatedCalenderEventMap,
								calenderGrid: [...calenderGrid, ...newCalenderGrid],
								startDate: updatedStartDate,
							}));
						}
					});
				},
				{
					threshold: 0.1,
					rootMargin: "100px",
				},
			);
			intersectionObserver.observe(node);

			return () => {
				intersectionObserver.disconnect();
			};
		},
		[calenderState],
	);

	useEffect(() => {
		const { calenderGrid, startDate: updatedStartDate } = calcGrid(
			calenderState.startDate,
			WEEK_COUNT_TO_LOAD,
		);

		// Event の fetch (range) してステート更新が必要

		const calenderEventMap = calcCalenderEventMap(
			calenderState.calenderEventMap,
			calenderEvents,
		);

		setCalenderState(() => ({
			calenderEvents,
			calenderGrid,
			calenderEventMap,
			startDate: updatedStartDate,
		}));

		ref.current?.scrollTo({
			left: ref.current.scrollWidth,
		});
	}, []);

	return (
		<div className="w-[70%] mx-auto">
			<div
				className="w-full aspect-[10/3] bg-gray-300 overflow-x-scroll flex flex-row-reverse
				relative text-indigo-950 gap-[1%] p-[0.5%] flex-nowrap"
				ref={ref}
			>
				{calenderState.calenderGrid.map((week, rowIndex, self) => {
					const isFirstWeekOfMonth = week.some((v) => v.date.getDate() === 1);

					const isFirstWeekOfYear =
						isFirstWeekOfMonth &&
						week.some((v) => v.date.getMonth() === 0) &&
						week.every((v) => v.date.getMonth() !== 1);

					const isObserved = rowIndex + 1 === self.length - WEEK_OFFSET_TO_LOAD;

					return (
						<>
							<div
								key={rowIndex}
								className="shrink-0 w-[3%] grid-rows-8 grid"
								{...(isObserved && { ref: observerRef })}
							>
								<div className="row-span-1 flex items-end justify-center flex-col">
									<span>
										{isFirstWeekOfYear
											? (week.at(0)?.date.getFullYear() ?? 0)
											: null}
									</span>
									<span>
										{isFirstWeekOfMonth
											? (week.at(0)?.date.getMonth() ?? 0) + 1
											: null}
									</span>
								</div>
								<div className="row-span-7 grid-rows-7 h-full grid gap-[1%]">
									{week.map((day, columnIndex) => {
										return (
											<div
												key={day.dateString}
												className={`bg-white flex justify-center items-center`}
												style={{ order: 7 - columnIndex }}
											>
												{
													calenderState.calenderEventMap.get(
														`${rowIndex}:${columnIndex}`,
													)?.message
												}
												{day.date.getDate()}
											</div>
										);
									})}
								</div>
							</div>
						</>
					);
				})}
			</div>
		</div>
	);
}
