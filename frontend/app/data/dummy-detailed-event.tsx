import type { DetailedEvent } from "@/features/calender/domains/events/domain";

// 詳細用サンプル
export const sampleDetailedEvent: DetailedEvent = {
	id: "1a",
	year: 2025,
	month: 4,
	date: 30,
	wakeUpTime: "07:00",
	bedTime: "23:30",
	achievements: ["study", "exercise", "reading"],
	weather: "cloudy",
	mood: {
		panasSf: {
			positive: 3.8,
			negative: 1.2,
			positiveItems: {
				alert: 4,
				inspired: 3,
				determined: 4,
				attentive: 4,
				active: 4,
			},
			negativeItems: {
				upset: 1,
				hostile: 1,
				ashamed: 2,
				nervous: 1,
				afraid: 1,
			},
		},
		vas: 78,
	},
	markdown: `# 今日の振り返り

## 良かったこと
- 朝の勉強がはかどった
- 運動で気分がリフレッシュできた

## 改善点
- もう少し早く寝たい

## 明日の目標
- [ ] 英語の勉強30分
- [ ] ランニング
`,
};
