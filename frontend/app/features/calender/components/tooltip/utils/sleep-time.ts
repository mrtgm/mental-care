export const getWakeUpIcon = (wakeUpTime: string): string => {
	const wakeHour = parseInt(wakeUpTime.split(":")[0]);
	const wakeMinute = parseInt(wakeUpTime.split(":")[1]);
	const wakeTimeInMinutes = wakeHour * 60 + wakeMinute;

	if (wakeTimeInMinutes <= 360) return "🌟"; // 6:00以前
	if (wakeTimeInMinutes <= 420) return "✨"; // 6:00-7:00
	if (wakeTimeInMinutes <= 480) return "👍"; // 7:00-8:00
	if (wakeTimeInMinutes <= 540) return "⚠️"; // 8:00-9:00
	return "😴"; // 9:00以降
};

export const getBedTimeIcon = (bedTime: string): string => {
	const bedHour = parseInt(bedTime.split(":")[0]);
	const bedMinute = parseInt(bedTime.split(":")[1]);
	let bedTimeInMinutes = bedHour * 60 + bedMinute;

	// 翌日の時刻の場合（0:00-5:59）は24時間を足す
	if (bedHour < 6) {
		bedTimeInMinutes += 24 * 60;
	}

	if (bedTimeInMinutes <= 1320) return "🌟"; // 22:00以前
	if (bedTimeInMinutes <= 1380) return "✨"; // 22:00-23:00
	if (bedTimeInMinutes <= 1440) return "👍"; // 23:00-24:00
	if (bedTimeInMinutes <= 1500) return "⚠️"; // 24:00-01:00
	return "🦉"; // 01:00以降
};
