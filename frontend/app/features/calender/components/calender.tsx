import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { useStore } from "@/store";
import { getMonthName } from "@/utils/date";
import { WEEK_OFFSET_TO_LOAD } from "../domains/events/constants";
import {
	type CalenderEvent,
	type GridDay,
	generateWeekId,
	getCalendarDateStyles,
} from "../domains/events/domain";
import { CalendarTooltip } from "./tooltip";

export const Calender = ({
	onDayClick,
	onWeekClick,
	onLoadMoreEvents,
}: {
	onLoadMoreEvents: () => Promise<void>;
	onDayClick: (day: GridDay, content: CalenderEvent | undefined) => void;
	onWeekClick: (week: GridDay[]) => void;
}) => {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const calenderStore = useStore.useSlice.calender();

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
		[calenderStore],
	);

	return (
		<div
			className="w-full h-64 overflow-x-scroll overflow-y-visible flex flex-row-reverse
						relative gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
		>
			<AnimatePresence>
				{calenderStore.calenderGrid.map((week, rowIndex, self) => {
					const totalLength = self.length;
					return (
						<CalanderWeek
							key={rowIndex}
							week={week}
							rowIndex={rowIndex}
							totalLength={totalLength}
							onDayClick={onDayClick}
							onWeekClick={onWeekClick}
							observerDomRef={observerDomRef}
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
	onWeekClick,
	observerDomRef,
}: {
	week: GridDay[];
	rowIndex: number;
	totalLength: number;
	onDayClick: (day: GridDay, content: CalenderEvent | undefined) => void;
	onWeekClick: (week: GridDay[]) => void;
	observerDomRef: (node: HTMLElement | null) => void;
}) => {
	const weekEvent = useStore.useSlice
		.calender()
		.weekEvents.find(
			(v) => v.id === generateWeekId(week[6].dateObj, week[0].dateObj),
		);

	const isFirstWeekOfMonth = week.some((v) => v.date === 1);
	const isFirstWeekOfYear =
		isFirstWeekOfMonth &&
		week.some((v) => v.month === 1) &&
		!week.some((v) => v.month === 2);

	const isObserved = rowIndex + 1 === totalLength - WEEK_OFFSET_TO_LOAD;
	const hasWeekEvent = !!weekEvent;
	const [isHoverOnHeader, setIsHoverOnHeader] = useState(false);

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
			<div
				className="h-[40px] flex items-center justify-center mb-3 cursor-pointer"
				onMouseEnter={() => setIsHoverOnHeader(true)}
				onMouseLeave={() => setIsHoverOnHeader(false)}
				onClick={() => onWeekClick(week)}
			>
				{isFirstWeekOfYear && (
					<span className="absolute top-0 text-sm text-orange-600">
						{week.at(0)?.year ?? 0}
					</span>
				)}
				{hasWeekEvent ? (
					<span className="rounded-lg  border-orange-400 w-[26px] h-[26px] absolute top-[21px] bg-orange-100 hover:bg-orange-200 transition-all duration-300" />
				) : (
					<AnimatePresence>
						{isHoverOnHeader && (
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="rounded-lg border border-orange-400 w-[26px] h-[26px] absolute top-[21px] bg-gradient-to-b from-orange-100 to-orange-200"
							></motion.span>
						)}
					</AnimatePresence>
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

	onDayClick,
}: {
	day: GridDay;
	rowIndex: number;
	columnIndex: number;

	onDayClick: (day: GridDay, content: CalenderEvent | undefined) => void;
}) => {
	const calenderState = useStore.useSlice.calender();

	const event = calenderState.eventMap.get(`${rowIndex}:${columnIndex}`);

	const isFutureDate = day.dateObj > new Date();
	const isCurrentDate =
		day.dateObj.toDateString() === new Date().toDateString();

	const className = getCalendarDateStyles(event, isCurrentDate, isFutureDate);

	return (
		<Tooltip key={day.dateString}>
			<TooltipTrigger asChild>
				<div
					className={className.className}
					data-score={className.moodScore}
					style={{ order: 7 - columnIndex, ...className.style }}
					onClick={() => onDayClick(day, event)}
				></div>
			</TooltipTrigger>
			<TooltipContent side="top" className="bg-black text-white border-black">
				<CalendarTooltip day={day} event={event} />
			</TooltipContent>
		</Tooltip>
	);
};
