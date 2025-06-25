

import {
	WeatherIconMap,
	WeatherLabelMap,
} from "../../domains/events/constants";
import type { Weather } from "../../domains/events/domain";

export const WeatherDisplay = ({ weather }: { weather: Weather }) => {
	return (
		<div className="space-y-1">
			<span>{WeatherIconMap[weather]}</span>
		</div>
	);
};
