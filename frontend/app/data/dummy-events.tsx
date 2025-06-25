import type { CalenderEvent } from "@/features/calender/domains/events/domain";

export const sampleEvents = [
	{
		id: "1",
		year: 2025,
		month: 5,
		date: 1,
		wakeUpTime: "07:00",
		bedTime: "23:30",
		achievements: ["study", "exercise", "reading"],
		mood: {
			panasSf: {
				positive: 3.8, // 1-5スケール（ポジティブ感情の平均）
				negative: 1.2, // 1-5スケール（ネガティブ感情の平均）
			},
			vas: 78, // 0-100スケール（Visual Analog Scale）
		},
	},
	{
		id: "2",
		year: 2025,
		month: 3,
		date: 23,
		wakeUpTime: "06:45",
		bedTime: "22:45",
		achievements: ["talk_with_friends", "walk", "personal_dev"],
		mood: {
			panasSf: {
				positive: 4.2,
				negative: 1.0,
			},
			vas: 85,
		},
	},
	{
		id: "3",
		year: 2024,
		month: 3,
		date: 23,
		wakeUpTime: "07:15",
		bedTime: "00:15",
		achievements: ["youtube_binge", "fight"],
		mood: {
			panasSf: {
				positive: 2.1,
				negative: 3.8,
			},
			vas: 32,
		},
	},
	{
		id: "4",
		year: 2024,
		month: 2,
		date: 23,
		wakeUpTime: "06:30",
		bedTime: "23:00",
		achievements: ["practice_instrument", "reading", "social_isolation"],
		mood: {
			panasSf: {
				positive: 3.0,
				negative: 2.4,
			},
			vas: 58,
		},
	},
] as const satisfies CalenderEvent[];
