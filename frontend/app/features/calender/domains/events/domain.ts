import { isSameDate } from "@/utils/date";

export type Achievement = {
	id: string;
	label: string;
	score: number;
	type: "positive" | "negative"; // 追加
};

export interface BaseMoodMetrics {
	vas: number; // 0-100スケール
}

export interface SummaryMoodMetrics extends BaseMoodMetrics {
	panasSf: {
		positive: number; // 1-5スケール（平均値）
		negative: number; // 1-5スケール（平均値）
	};
}

export interface DetailedMoodMetrics extends BaseMoodMetrics {
	panasSf: {
		positive: number; // 平均値（計算値）
		negative: number; // 平均値（計算値）
		positiveItems: {
			alert: number; // 注意深い
			inspired: number; // ひらめいた
			determined: number; // 決意を持った
			attentive: number; // 集中していた
			active: number; // 活動的だった
		};
		negativeItems: {
			upset: number; // 動揺した
			hostile: number; // 敵意を感じた
			ashamed: number; // 恥ずかしかった
			nervous: number; // 緊張した
			afraid: number; // 恐れを感じた
		};
	};
}

export type Weather =
	| "sunny"
	| "cloudy"
	| "rainy"
	| "snowy"
	| "stormy"
	| "foggy";

export type CalenderEvent = {
	id: string; // yyyy-mm-dd
	year: number;
	month: number;
	date: number;
	wakeUpTime: string; // "HH:MM"形式
	bedTime: string; // "HH:MM"形式
	achievements: string[]; // achievement IDの配列
	weather: Weather;
	mood: SummaryMoodMetrics;
};

export type DetailedEvent = {
	mood: DetailedMoodMetrics;
	markdown: string;
} & Omit<CalenderEvent, "mood">;

export type CalenderWeekEvent = {
	id: string;
};

export type DetailedWeekEvent = {
	weeklyGoals: string;
	weeklyReflection: string;
} & CalenderWeekEvent;

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

export const generateWeekId = (startDate: Date, endDate: Date) => {
	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	};
	return `${formatDate(startDate)}_${formatDate(endDate)}`;
};

export const calculateMoodScore = (mood: SummaryMoodMetrics): number => {
	const { vas, panasSf } = mood;
	// 0-100 に正規化
	const positiveNormalized = ((panasSf.positive - 1) / 4) * 100;
	const negativeNormalized = ((5 - panasSf.negative) / 4) * 100;
	const panasScore = (positiveNormalized + negativeNormalized) / 2;

	// VAS(70%) + PANAS(30%)
	const blendedScore = vas * 0.7 + panasScore * 0.3;
	return Math.max(0, Math.min(100, blendedScore));
};

export const getMoodBasedColors = (
	moodScore: number,
): {
	backgroundColor: string;
	borderColor: string;
	hoverBackgroundColor: string;
} => {
	const intensity = moodScore / 100;

	const hue = 25; // オレンジの色相
	const saturation = 70 + intensity * 20; // 70-90%
	const lightness = 85 - intensity * 40; // 85%(薄い) → 45%(濃い)

	const borderLightness = Math.max(lightness - 15, 25);
	const hoverLightness = Math.max(lightness - 10, 30);

	return {
		backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
		borderColor: `hsl(${hue}, ${saturation + 5}%, ${borderLightness}%)`,
		hoverBackgroundColor: `hsl(${hue}, ${saturation + 5}%, ${hoverLightness}%)`,
	};
};

export const getCalendarDateStyles = (
	event: CalenderEvent | undefined,
	isCurrentDate: boolean,
	isFutureDate: boolean,
): {
	className: string;
	moodScore?: number;
	style?: React.CSSProperties;
} => {
	const baseClass =
		"w-6 h-6 rounded-md border-1 transition-all duration-300 hover:scale-110 hover:shadow-md cursor-pointer";

	if (isCurrentDate) {
		return {
			className: `${baseClass} bg-green-200 border-green-300`,
		};
	}

	if (isFutureDate) {
		return {
			className:
				"w-6 h-6 rounded-md border-1 transition-all duration-300 hover:scale-110 hover:shadow-md bg-gray-50 border-white cursor-not-allowed",
		};
	}

	if (event) {
		const moodScore = calculateMoodScore(event.mood);
		const colors = getMoodBasedColors(moodScore);

		return {
			className: baseClass,
			moodScore: moodScore,
			style: {
				backgroundColor: colors.backgroundColor,
				borderColor: colors.borderColor,
			},
		};
	}

	return {
		className: `${baseClass} bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300`,
	};
};
