import { FieldLabelMap } from "../../domains/events/constants";
import type { Achievement } from "../../domains/events/domain";
import {
	calculateTotalScore,
	getAchievementsByType,
	getTotalScoreColor,
} from "./utils/achievements";

const AchievementItem = ({
	achievement,
	type,
}: {
	achievement: Achievement;
	type: Achievement["type"];
}) => {
	const isPositive = type === "positive";

	return (
		<div className="flex items-center gap-1">
			<span className={isPositive ? "text-green-400" : "text-red-400"}>
				{isPositive ? "✓" : "✗"}
			</span>
			<span className={isPositive ? "text-green-300" : "text-red-300"}>
				{achievement.label}
			</span>
			<span
				className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
			>
				({isPositive ? "+" : ""}
				{achievement.score})
			</span>
		</div>
	);
};

const AchievementTotal = ({ totalScore }: { totalScore: number }) => {
	return (
		<div className="border-t border-gray-600 pt-1 mt-1">
			<div className="flex items-center justify-between">
				<span className="text-gray-300">Total Score:</span>
				<span className={`font-semibold ${getTotalScoreColor(totalScore)}`}>
					{totalScore > 0 ? "+" : ""}
					{totalScore}
				</span>
			</div>
		</div>
	);
};

export const AchievementsDisplay = ({
	achievements,
}: {
	achievements: string[];
}) => {
	const positiveAchievements = getAchievementsByType(achievements, "positive");
	const negativeAchievements = getAchievementsByType(achievements, "negative");
	const totalScore = calculateTotalScore(achievements);

	return (
		<div>
			<div className="text-yellow-400 text-xs mb-1">
				{FieldLabelMap.achievements}:
			</div>

			<div className="ml-2 space-y-1">
				{positiveAchievements.map((achievement, index) => (
					<AchievementItem
						key={`positive-${index}`}
						achievement={achievement}
						type="positive"
					/>
				))}

				{negativeAchievements.map((achievement, index) => (
					<AchievementItem
						key={`negative-${index}`}
						achievement={achievement}
						type="negative"
					/>
				))}

				<AchievementTotal totalScore={totalScore} />
			</div>
		</div>
	);
};
