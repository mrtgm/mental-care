import { isSameDate } from "@/utils/date";

export type Achievement = {
	id: string;
	label: string;
	score: number;
	type: "positive" | "negative"; // 追加
};

export type MoodMetrics = {
	panasSf: {
		positive: number; // 1-5スケール
		negative: number; // 1-5スケール
	};
	vas: number; // 0-100スケール
};

export type CalenderEvent = {
	id: string; // ここはISO8601でいいかな
	year: number;
	month: number;
	date: number;
	wakeUpTime: string; // "HH:MM"形式
	bedTime: string; // "HH:MM"形式
	achievements: string[]; // achievement IDの配列
	mood: MoodMetrics;
};

export type CalenderEventMap = Map<`${number}:${number}`, CalenderEvent>;

// パターンを考える
export type CalenderEventContent = {
	[key in string]: string;
};

export type GridDay = {
	year: number;
	month: number;
	date: number;
	dateObj: Date;
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
	events: CalenderEvent[],
): CalenderEventMap => {
	const calenderEventMap: CalenderEventMap = new Map();
	for (const event of events) {
		calenderEventMap.set(calcCalenderGridIndex(event), event);
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
			});

			now.setDate(now.getDate() - 1);
		}

		calenderGrid.push(week);
		remainingWeeks--;
	}

	return { calenderGrid, startDate: new Date(now) };
};
