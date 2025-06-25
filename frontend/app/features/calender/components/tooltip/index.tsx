import { FieldLabelMap } from "../../domains/events/constants";
import type { CalenderEvent, GridDay } from "../../domains/events/domain";
import { AchievementsDisplay } from "./achivements-display";
import { MoodDisplay } from "./mood-display";
import { SleepTimeDisplay } from "./sleep-time-display";
import { WeatherDisplay } from "./weather-display";

interface CalendarTooltipProps {
	day: GridDay;
	event?: CalenderEvent;
}

export const CalendarTooltip = ({ day, event }: CalendarTooltipProps) => {
	return (
		<div className="text-xs">
			<div className="font-medium flex items-center gap-2">
				{day.year}/{day.month}/{day.date}
				{event ? <WeatherDisplay weather={event.weather} /> : null}
			</div>

			{event && (
				<div className="space-y-2 mt-2">
					<SleepTimeDisplay
						wakeUpTime={event.wakeUpTime}
						bedTime={event.bedTime}
					/>

					{event.achievements && event.achievements.length > 0 && (
						<AchievementsDisplay achievements={event.achievements} />
					)}

					{event.mood && <MoodDisplay mood={event.mood} />}
				</div>
			)}
		</div>
	);
};
