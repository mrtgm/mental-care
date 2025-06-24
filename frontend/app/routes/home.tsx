import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import {
	WEEK_COUNT_TO_LOAD,
	WEEK_OFFSET_TO_LOAD,
} from "@/features/calender/domains/events/constants";
import {
	type CalenderEvent,
	type CalenderEventMap,
	type CalenderGrid,
	calcCalenderEventMap,
	calcGrid,
} from "@/features/calender/domains/events/domain";
import { getMonthName } from "@/utils/date";
import { debounce } from "@/utils/function";
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
	{
		year: 2024,
		month: 2,
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

	const observerRef = useRef<IntersectionObserver | null>(null);

	const observerDomRef = useCallback(
		(node: HTMLElement | null) => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			observerRef.current = new IntersectionObserver(
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

			if (!node) return;
			observerRef.current.observe(node);
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
			loadedRows: WEEK_COUNT_TO_LOAD,
			startDate: updatedStartDate,
		}));

		ref.current?.scrollTo({
			left: ref.current.scrollWidth,
		});
	}, []);

	return (
		<TooltipProvider>
			<div className="w-full max-w-7xl mx-auto px-6 py-8 bg-white min-h-screen">
				{/* カレンダー本体 */}
				<div className="bg-white rounded-2xl border-gray-200 p-6 relative">
					<div className="absolute left-0 top-0 bottom-0 w-32 h-72 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

					<div
						className="w-full h-64 overflow-x-scroll overflow-y-visible flex flex-row-reverse
						relative gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
						ref={ref}
					>
						<AnimatePresence>
							{calenderState.calenderGrid.map((week, rowIndex, self) => {
								const isFirstWeekOfMonth = week.some((v) => v.date === 1);
								const isFirstWeekOfYear =
									isFirstWeekOfMonth &&
									week.some((v) => v.month === 1) &&
									!week.some((v) => v.month === 2);

								const isObserved =
									rowIndex + 1 === self.length - WEEK_OFFSET_TO_LOAD;

								return (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 1, ease: "easeInOut" }}
										exit={{ opacity: 0, y: -20 }}
										key={rowIndex}
										className="flex-shrink-0 w-6 h-full flex flex-col"
										{...(isObserved && { ref: observerDomRef })}
									>
										<div className="h-[40px] flex items-center justify-center mb-3">
											{isFirstWeekOfYear && (
												<span className="absolute top-0 text-sm text-gray-500">
													{week.at(0)?.year ?? 0}
												</span>
											)}
											{isFirstWeekOfMonth && (
												<span className="absolute top-[26px] text-xs text-gray-500">
													{getMonthName(week.at(0)?.month)}
												</span>
											)}
										</div>

										<div className="flex-1 flex flex-col gap-1.5">
											{week.map((day, columnIndex) => {
												const content = calenderState.calenderEventMap.get(
													`${rowIndex}:${columnIndex}`,
												);
												const hasContent = Boolean(content?.message);

												return (
													<Tooltip key={day.dateString}>
														<TooltipTrigger asChild>
															<div
																className={`
																w-6 h-6 rounded-md border-1 transition-all duration-300
																hover:scale-110 hover:shadow-md cursor-pointer
																${
																	hasContent
																		? "bg-orange-500 border-orange-600 hover:bg-orange-600 shadow-sm"
																		: "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
																}
															`}
																style={{ order: 7 - columnIndex }}
															></div>
														</TooltipTrigger>
														<TooltipContent
															side="top"
															className="bg-black text-white border-black"
														>
															<p className="text-xs">
																{day.year}/{day.month}/{day.date}
																{hasContent ? ` - ${content?.message}` : ""}
															</p>
														</TooltipContent>
													</Tooltip>
												);
											})}
										</div>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>

					<div className="flex items-center justify-between mt-6 pt-6 border-t-1 border-gray-200">
						<div className="flex items-center gap-3 text-sm text-gray-700">
							<div className="flex gap-1.5">
								<div className="w-4 h-4 rounded-sm bg-orange-100 border-1 border-orange-200"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-200 border-1 border-orange-300"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-400 border-1 border-orange-500"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-500 border-1 border-orange-600"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-700 border-1 border-orange-800"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
