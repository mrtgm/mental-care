export const isSameDate = (date1: Date, date2: Date): boolean => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

export const getMonthName = (
	monthNumber: number | undefined,
	locale = "en-US",
	format: "short" | "long" | "narrow" = "short",
) => {
	if (!monthNumber) return "";
	const date = new Date(2000, monthNumber - 1);
	return new Intl.DateTimeFormat(locale, { month: format }).format(date);
};
