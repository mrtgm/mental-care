import { FieldLabelMap } from "../../domains/events/constants";
import { getBedTimeIcon, getWakeUpIcon } from "./utils/sleep-time";

interface SleepTimeDisplayProps {
	wakeUpTime: string;
	bedTime: string;
}

export const SleepTimeDisplay = ({
	wakeUpTime,
	bedTime,
}: SleepTimeDisplayProps) => {
	return (
		<div className="space-y-1">
			<div className="flex items-center gap-2">
				<span className="text-green-400">🌅</span>
				<span>
					{FieldLabelMap.wakeUpTime}: {wakeUpTime}
				</span>
				<span>{getWakeUpIcon(wakeUpTime)}</span>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-blue-400">🌙</span>
				<span>
					{FieldLabelMap.bedTime}: {bedTime}
				</span>
				<span>{getBedTimeIcon(bedTime)}</span>
			</div>
		</div>
	);
};
