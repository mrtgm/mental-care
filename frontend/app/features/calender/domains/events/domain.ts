import { isSameDate } from "~/utils/date";

export type CalenderEvent = {
	year: number;
	month: number;
	date: number;
	content: CalenderEventContent;
};

export type CalenderEventMap = Map<`${number}:${number}`, CalenderEventContent>;

// パターンを考える
export type CalenderEventContent = {
	[key in string]: string;
};

export type GridDay = {
	year: number;
	month: number;
	date: number;
	dateObj: Date;
	event: CalenderEventContent | null;
	dateString: string;
};

export type CalenderGrid = GridDay[][];

export const createDateFromEvent = (event: CalenderEvent): Date => {
	return new Date(event.year, event.month - 1, event.date);
};

const calcCalenderGridIndex = (event: CalenderEvent) => {
	const now = new Date();
	const eventDate = createDateFromEvent(event);

	if (eventDate.getTime() > now.getTime()) throw new Error("Invalid Date");

	// 土曜に
	now.setDate(now.getDate() + (6 - now.getDay()));

	const rowIndex =
		((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24 * 7)) | 0;
	const columnIndex = 6 - eventDate.getDay();

	return `${rowIndex}:${columnIndex}` as `${number}:${number}`;
};

export const calcCalenderEventMap = (
	calenderEventMap: CalenderEventMap,
	events: CalenderEvent[],
): CalenderEventMap => {
	for (const event of events) {
		calenderEventMap.set(calcCalenderGridIndex(event), event.content);
	}

	return calenderEventMap;
};

export const calcGrid = (
	startDate: Date,
	weekCountToLoad: number,
): {
	calenderGrid: CalenderGrid;
	startDate: Date;
} => {
	const calenderGrid: CalenderGrid = [];

	let remainingWeeks = weekCountToLoad;

	// 土曜に
	const now = new Date(startDate);
	now.setDate(now.getDate() + (6 - now.getDay()));

	while (remainingWeeks > 0) {
		const week: GridDay[] = [];

		for (let i = 0; i < 7; i++) {
			week.push({
				year: now.getFullYear(),
				month: now.getMonth() + 1,
				date: now.getDate(),
				dateObj: new Date(now),
				dateString: now.toLocaleString(),
				event: null,
			});

			now.setDate(now.getDate() - 1);
		}

		calenderGrid.push(week);
		remainingWeeks--;
	}

	return { calenderGrid, startDate: new Date(now) };
};
