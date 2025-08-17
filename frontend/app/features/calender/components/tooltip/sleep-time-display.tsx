import { Link } from "react-router";
import { FieldLabelMap } from "../../domains/events/constants";
import { getBedTimeIcon, getWakeUpIcon } from "./utils/sleep-time";

export const SleepTimeDisplay = ({ eventId, wakeUpTime, bedTime }: { eventId: string; wakeUpTime: string; bedTime: string }) => {
  return (
    <div className="space-y-1 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-white">Wake:</span>
        <Link to={`/graph?eventId=${eventId}&target=wakeuptime`} className="text-white underline" title={`Wake up time: ${wakeUpTime}`}>
          {wakeUpTime}
        </Link>
        {/* <span>{getWakeUpIcon(wakeUpTime)}</span> */}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white">Sleep:</span>
        <Link to={`/graph?eventId=${eventId}&target=bedtime`} className="text-white underline" title={`Sleep time: ${bedTime}`}>
          {bedTime}
        </Link>
        {/* <span>{getBedTimeIcon(bedTime)}</span> */}
      </div>
    </div>
  );
};
