export const WEEK_COUNT_TO_LOAD = 30; // 30週読み込む
export const WEEK_OFFSET_TO_LOAD = 10; // 最後から10週目が画面に入ったら読み込む

export const FieldLabelMap = {
	wakeUpTime: "Wake Up Time",
	bedTime: "Bed Time",
	achievements: "Achievements",
	mood: "Mood",
	panasSf: "PANAS-SF",
	positive: "Positive Affect",
	negative: "Negative Affect",
	vas: "Visual Analog Scale",
	content: "Content",
	message: "Message",
	year: "Year",
	month: "Month",
	date: "Date",
} as const;

export const WeatherLabelMap = {
	sunny: "Sunny",
	cloudy: "Cloudy",
	rainy: "Rainy",
	snowy: "Snowy",
	stormy: "Stormy",
	foggy: "Foggy",
} as const;

export const WeatherIconMap = {
	sunny: "☀️",
	cloudy: "☁️",
	rainy: "🌧️",
	snowy: "❄️",
	stormy: "⛈️",
	foggy: "🌫️",
} as const;

export const PanasSfLabelMap = {
	positive: {
		alert: "Alert (注意深い)",
		inspired: "Inspired (ひらめいた)",
		determined: "Determined (決意を持った)",
		attentive: "Attentive (集中していた)",
		active: "Active (活動的だった)",
	},
	negative: {
		upset: "Upset (動揺した)",
		hostile: "Hostile (敵意を感じた)",
		ashamed: "Ashamed (恥ずかしかった)",
		nervous: "Nervous (緊張した)",
		afraid: "Afraid (恐れを感じた)",
	},
} as const;
