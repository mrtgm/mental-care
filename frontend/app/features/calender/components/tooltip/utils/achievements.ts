import { achievementsMaster } from "@/data/dummy-achievements";
import type { Achievement } from "../../../domains/events/domain";

export const getAchievementsByType = (
	achievementIds: string[],
	type: "positive" | "negative",
): Achievement[] => {
	return achievementIds
		.map((id) => achievementsMaster.find((a) => a.id === id))
		.filter(
			(achievement): achievement is Achievement =>
				achievement !== undefined && achievement.type === type,
		);
};

export const calculateTotalScore = (achievementIds: string[]): number => {
	return achievementIds
		.map((id) => achievementsMaster.find((a) => a.id === id)?.score || 0)
		.reduce((sum, score) => sum + score, 0 as number);
};

export const getTotalScoreColor = (totalScore: number): string => {
	if (totalScore > 0) return "text-green-400";
	if (totalScore < 0) return "text-red-400";
	return "text-gray-400";
};
