import { useCallback, useEffect, useRef, useState } from "react";
import {
	WEEK_COUNT_TO_LOAD,
	WEEK_OFFSET_TO_LOAD,
} from "~/features/calender/domains/events/constants";
import {
	attachEventsToGrid,
	type CalenderGrid,
	calcGrid,
} from "~/features/calender/domains/events/domain";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

const events = [
	{
		year: 2025,
		month: 5,
		date: 30,
		content: {
			message: "yes",
		},
	},
	{
		year: 2025,
		month: 3,
		date: 23,
		content: {
			message: "yes",
		},
	},
	{
		year: 2024,
		month: 3,
		date: 23,
		content: {
			message: "yes",
		},
	},
];

export default function Home() {
	const ref = useRef<HTMLDivElement>(null);

	const [consumedEventCount, setConsumedEventCount] = useState(0);
	const [grid, setGrid] = useState<CalenderGrid>([]);
	const [lastGridDate, setLastGridDate] = useState<Date>(new Date());

	const observerRef = useCallback(
		(node: HTMLElement | null) => {
			if (!node) return;
			const intersectionObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && consumedEventCount < events.length) {
							// ここでホントは 新規に読むこむべきイベントがある時、fetch
							// loding 中なら弾く、とか

							const { grid: newGrids, lastGridDate: newLastGridDate } =
								calcGrid(WEEK_COUNT_TO_LOAD, lastGridDate);

							const { gridWithEvents, updatedConsumedEventCount } =
								attachEventsToGrid(newGrids, events, consumedEventCount);

							setConsumedEventCount(updatedConsumedEventCount);
							setGrid((prev) => [...prev, ...gridWithEvents]);
							setLastGridDate(newLastGridDate);
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
		[grid, lastGridDate],
	);

	useEffect(() => {
		const { grid, lastGridDate } = calcGrid(WEEK_COUNT_TO_LOAD, new Date());

		const { gridWithEvents, updatedConsumedEventCount } = attachEventsToGrid(
			grid,
			events,
			consumedEventCount,
		);

		setConsumedEventCount(updatedConsumedEventCount);
		setGrid(gridWithEvents);
		setLastGridDate(lastGridDate);

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
				{grid.map((week, rowIndex, self) => {
					const isFirstWeek = !!week.find((v) => v?.date.getDate() === 1);
					const isObserved = rowIndex + 1 === self.length - WEEK_OFFSET_TO_LOAD;

					return (
						<>
							<div
								key={rowIndex}
								className="shrink-0 w-[3%] grid-rows-8 grid"
								{...(isObserved && { ref: observerRef })}
							>
								<div className="row-span-1 flex items-end justify-center">
									{isFirstWeek ? (week.at(0)?.date.getMonth() ?? 0) + 1 : null}
								</div>
								<div className="row-span-7 grid-rows-7 h-full grid gap-[1%]">
									{week.map((v, columnIndex) => {
										return (
											<div
												key={v ? v.dateString : columnIndex}
												className={`bg-white flex justify-center items-center`}
												style={{ order: 7 - columnIndex }}
											>
												{v ? v.event?.message : null}
												{/* {v ? v.date.getDate() : null} */}
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
