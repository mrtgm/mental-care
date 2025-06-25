import { FieldLabelMap } from "../../domains/events/constants";
import { getBedTimeIcon, getWakeUpIcon } from "./utils/sleep-time";


export const SleepTimeDisplay = ({
	wakeUpTime,
	bedTime,
}: {
	wakeUpTime: string;
	bedTime: string;
}) => {
	return (
		<div className="space-y-1 text-xs">
			<div className="flex items-center gap-2">
				<span className="text-green-400">🌅</span>
				<span>{wakeUpTime}</span>
				<span>{getWakeUpIcon(wakeUpTime)}</span>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-blue-400">🌙</span>
				<span>{bedTime}</span>
				<span>{getBedTimeIcon(bedTime)}</span>
			</div>
		</div>
	);
};
