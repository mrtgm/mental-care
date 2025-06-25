import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { getMonthName } from "@/utils/date";
import { WEEK_OFFSET_TO_LOAD } from "../domains/events/constants";
import type {
	CalenderEventContent,
	CalenderEventMap,
	CalenderGrid,
	GridDay,
} from "../domains/events/domain";

export const Calender = ({
	calenderState,
	onDayClick,
	onLoadMoreEvents,
}: {
	calenderState: {
		calenderGrid: CalenderGrid;
		calenderEventMap: CalenderEventMap;
	};
	onLoadMoreEvents: () => Promise<void>;
	onDayClick: (day: GridDay, content: CalenderEventContent) => void;
}) => {
	const observerRef = useRef<IntersectionObserver | null>(null);

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
		[calenderState],
	);

	return (
		<div
			className="w-full h-64 overflow-x-scroll overflow-y-visible flex flex-row-reverse
						relative gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
		>
			<AnimatePresence>
				{calenderState.calenderGrid.map((week, rowIndex, self) => {
					const totalLength = self.length;
					return (
						<CalanderWeek
							key={rowIndex}
							week={week}
							rowIndex={rowIndex}
							totalLength={totalLength}
							onDayClick={onDayClick}
							observerDomRef={observerDomRef}
							calenderState={calenderState}
						/>
					);
				})}
			</AnimatePresence>
		</div>
	);
};

const CalanderWeek = ({
	week,
	rowIndex,
	totalLength,
	onDayClick,
	observerDomRef,
	calenderState,
}: {
	week: GridDay[];
	rowIndex: number;
	totalLength: number;
	onDayClick: (day: GridDay, content: CalenderEventContent) => void;
	observerDomRef: (node: HTMLElement | null) => void;
	calenderState: {
		calenderEventMap: CalenderEventMap;
	};
}) => {
	const isFirstWeekOfMonth = week.some((v) => v.date === 1);
	const isFirstWeekOfYear =
		isFirstWeekOfMonth &&
		week.some((v) => v.month === 1) &&
		!week.some((v) => v.month === 2);

	const isObserved = rowIndex + 1 === totalLength - WEEK_OFFSET_TO_LOAD;

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
					<span className="absolute top-0 text-sm text-orange-600">
						{week.at(0)?.year ?? 0}
					</span>
				)}
				{isFirstWeekOfMonth && (
					<span className="absolute top-[26px] text-xs text-orange-600">
						{getMonthName(week.at(0)?.month)}
					</span>
				)}
			</div>

			<div className="flex-1 flex flex-col gap-1.5">
				<TooltipProvider>
					{week.map((day, columnIndex) => (
						<CalenderDate
							key={day.dateString}
							day={day}
							rowIndex={rowIndex}
							columnIndex={columnIndex}
							calenderState={calenderState}
							onDayClick={onDayClick}
						/>
					))}
				</TooltipProvider>
			</div>
		</motion.div>
	);
};

const CalenderDate = ({
	day,
	rowIndex,
	columnIndex,
	calenderState,
	onDayClick,
}: {
	day: GridDay;
	rowIndex: number;
	columnIndex: number;
	calenderState: {
		calenderEventMap: CalenderEventMap;
	};
	onDayClick: (day: GridDay, content: CalenderEventContent) => void;
}) => {
	const content = calenderState.calenderEventMap.get(
		`${rowIndex}:${columnIndex}`,
	);

	const hasContent = Boolean(content?.message);
	const isFutureDate = day.dateObj > new Date();
	const isCurrentDate =
		day.dateObj.toDateString() === new Date().toDateString();

	return (
		<Tooltip key={day.dateString}>
			<TooltipTrigger asChild>
				<div
					className={`
            w-6 h-6 rounded-md border-1 transition-all duration-300
            hover:scale-110 hover:shadow-md
            ${
							isCurrentDate
								? "bg-green-200 border-green-300 shadow-sm cursor-pointer"
								: isFutureDate
									? "bg-gray-50 border-white cursor-not-allowed"
									: hasContent
										? "bg-orange-500 border-orange-600 hover:bg-orange-600 shadow-sm cursor-pointer"
										: "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 cursor-pointer"
						}
          `}
					style={{ order: 7 - columnIndex }}
					onClick={() => content && onDayClick(day, content)} // TODO:なんかする
				></div>
			</TooltipTrigger>
			<TooltipContent side="top" className="bg-black text-white border-black">
				<p className="text-xs">
					{day.year}/{day.month}/{day.date}
					{hasContent ? ` - ${content?.message}` : ""}
				</p>
			</TooltipContent>
		</Tooltip>
	);
};
