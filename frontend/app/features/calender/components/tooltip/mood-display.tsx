import { FieldLabelMap } from "../../domains/events/constants";
import type { MoodMetrics } from "../../domains/events/domain";
import {
	calculatePanasScore,
	getMoodColor,
	getMoodEmoji,
	getVasColor,
	getVasTextColor,
} from "./utils/mood";

interface MoodDisplayProps {
	mood: MoodMetrics;
}

export const MoodDisplay = ({ mood }: MoodDisplayProps) => {
	const panasScore = calculatePanasScore(mood);

	return (
		<div>
			<div className="text-purple-400 text-xs mb-1">{FieldLabelMap.mood}:</div>

			<div className="ml-2 space-y-1">
				<div className="flex items-center gap-2">
					<span className="text-gray-300">VAS:</span>
					<div className="flex-1 flex items-center gap-1">
						<div className="w-12 h-1.5 bg-gray-600 rounded-full overflow-hidden">
							<div
								className={`h-full rounded-full transition-all ${getVasColor(mood.vas)}`}
								style={{ width: `${mood.vas}%` }}
							/>
						</div>
						<span
							className={`text-xs font-medium ${getVasTextColor(mood.vas)}`}
						>
							{mood.vas}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-gray-300">PANAS:</span>
					<div className="flex items-center gap-1">
						<span>{getMoodEmoji(panasScore)}</span>
						<span className={`font-medium ${getMoodColor(panasScore)}`}>
							{panasScore > 0 ? "+" : ""}
							{panasScore.toFixed(1)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
