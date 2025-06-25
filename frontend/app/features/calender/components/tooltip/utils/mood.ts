import type { SummaryMoodMetrics } from "../../../domains/events/domain";

export const getMoodEmoji = (panasScore: number): string => {
	if (panasScore > 1.5) return "😊";
	if (panasScore > 0.5) return "🙂";
	if (panasScore > -0.5) return "😐";
	if (panasScore > -1.5) return "😔";
	return "😞";
};

export const getMoodColor = (panasScore: number): string => {
	if (panasScore > 1) return "text-green-400";
	if (panasScore > 0) return "text-yellow-400";
	if (panasScore > -1) return "text-orange-400";
	return "text-red-400";
};

export const getVasColor = (vasScore: number): string => {
	if (vasScore >= 70) return "bg-green-400";
	if (vasScore >= 40) return "bg-yellow-400";
	return "bg-red-400";
};

export const getVasTextColor = (vasScore: number): string => {
	if (vasScore >= 70) return "text-green-400";
	if (vasScore >= 40) return "text-yellow-400";
	return "text-red-400";
};

export const getVasImageUrl = (vasScore: number): string =>
	`/faces/${Math.min(((20 - vasScore / 5) | 0) + 1, 20)}.webp`;

export const calculatePanasScore = (mood: SummaryMoodMetrics): number => {
	return mood.panasSf.positive - mood.panasSf.negative;
};
