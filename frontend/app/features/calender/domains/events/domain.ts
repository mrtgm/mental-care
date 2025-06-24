import { isSameDate } from "~/utils/date";

export type CalenderEvent = {
	year: number;
	month: number;
	date: number;
	content: CalenderEventContent;
};

// パターンを考える
export type CalenderEventContent = {
	[key in string]: string;
};

export type GridDay = {
	date: Date;
	event: CalenderEventContent | null;
	dateString: string;
};

export type CalenderGrid = (GridDay | null)[][];

export const createDateFromEvent = (event: CalenderEvent): Date => {
	return new Date(event.year, event.month - 1, event.date);
};

export const calcGrid = (
	weekCountToLoad: number,
	startDate: Date,
): {
	grid: CalenderGrid;
	lastGridDate: Date;
} => {
	const grid: CalenderGrid = [];

	const now = startDate;
	let remainingWeeks = weekCountToLoad;

	while (remainingWeeks > 0) {
		const week: (GridDay | null)[] = [];

		for (let i = 0; i < 7; i++) {
			// 最初の週の空白セルを処理
			const isFirstWeek = remainingWeeks === weekCountToLoad;
			const shouldSkipDay = isFirstWeek && i < 6 - now.getDay();

			if (shouldSkipDay) {
				week.push(null);
				continue;
			}

			week.push({
				date: new Date(now),
				dateString: now.toLocaleString(),
				event: null,
			});

			now.setDate(now.getDate() - 1);
		}

		grid.push(week);
		remainingWeeks--;
	}

	return { grid, lastGridDate: new Date(now) };
};

export const attachEventsToGrid = (
	grid: CalenderGrid,
	events: CalenderEvent[],
	consumedEventCount: number,
) => {
	const clonedGrid = [...grid];

	const sortedEvents = [...events.slice(consumedEventCount)].sort(
		(a, b) =>
			new Date(b.year, b.month - 1, b.date).getTime() -
			new Date(a.year, a.month - 1, a.date).getTime(),
	);

	for (const week of clonedGrid) {
		for (const day of week) {
			if (!day) continue;
			let matchedEvent = null;

			if (sortedEvents.length > 0) {
				const firstEvent = sortedEvents[0];
				const eventDate = createDateFromEvent(firstEvent);

				if (isSameDate(eventDate, day.date)) {
					matchedEvent = events[0];
					sortedEvents.shift();
					consumedEventCount++;
				}
			}
			day.event = matchedEvent ? matchedEvent.content : null;
		}
	}

	return {
		gridWithEvents: clonedGrid,
		updatedConsumedEventCount: consumedEventCount,
	};
};
