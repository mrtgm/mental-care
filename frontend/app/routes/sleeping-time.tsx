import { useParams } from "react-router";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Header } from "@/components/header";
import { sampleEvents } from "@/data/dummy-events";
import type { Route } from "./+types/week";

export function meta({ params }: Route.MetaArgs) {
	return [{ title: `Sleeping Time` }];
}

const timeToMinutes = (timeStr: string) => {
	const [hours, minutes] = timeStr.split(":").map(Number);
	return hours * 60 + minutes;
};

const generateYAxisTicks = () => {
	const ticks = [];
	for (let hour = 0; hour <= 24; hour += 4) {
		ticks.push(hour * 60);
	}
	return ticks;
};

const formatXAxisTick = (value: number) => {
	const date = new Date(value);
	return `${date.getMonth() + 1}/${date.getDate()}`;
};

const minutesToTime = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const formatYAxisTick = (value: number) => {
	return minutesToTime(value);
};

const chartData = sampleEvents
	.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime()) // 日付順にソート
	.map((event) => {
		let bedTimeMinutes = timeToMinutes(event.bedTime);

		// 就寝時間が深夜の場合（0:00-6:00）は次の日として扱う（24時間を加算）
		if (bedTimeMinutes < 360) {
			// 6:00 = 360分
			bedTimeMinutes += 24 * 60;
		}

		return {
			date: event.id,
			dateFormatted: `${event.year}/${event.month}/${event.date}`,
			wakeUpTime: timeToMinutes(event.wakeUpTime),
			bedTime: bedTimeMinutes,
			originalWakeUp: event.wakeUpTime,
			originalBedTime: event.bedTime,
		};
	});

const CustomTooltip = ({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: {
		color: string;
		name: string;
		value: number;
	}[];
	label?: string;
}) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
				<p className="font-medium text-gray-800">{`日付: ${label}`}</p>
				{payload.map((entry, index) => (
					<p key={index} style={{ color: entry.color }} className="text-sm">
						{`${entry.name}: ${minutesToTime(entry.value)}`}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function Week() {
	const { weekId } = useParams();

	console.log(chartData);

	return (
		<div className="w-full max-w-7xl mx-auto px-6 py-8 bg-white min-h-screen sm:max-w-full">
			<Header />
			<div className="bg-white rounded-2xl border-gray-200 p-6 relative mb-8 sm:px-0">
				<div className="absolute left-0 top-0 bottom-0 w-full h-72">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 20,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

							<XAxis
								dataKey="date"
								tickFormatter={formatXAxisTick}
								stroke="#666"
								fontSize={12}
							/>

							<YAxis
								domain={[300, 1500]} // 5:00から25:00（翌日1:00）まで
								ticks={generateYAxisTicks()}
								tickFormatter={formatYAxisTick}
								stroke="#666"
								fontSize={12}
							/>

							<Tooltip content={<CustomTooltip />} />

							<Legend
								wrapperStyle={{
									paddingTop: "20px",
									fontSize: "14px",
								}}
							/>

							<Line
								type="monotone"
								dataKey="wakeUpTime"
								stroke="#f97316"
								strokeWidth={3}
								name="起床時間"
								dot={{ fill: "#f97316", strokeWidth: 2, r: 5 }}
								activeDot={{ r: 7, stroke: "#f97316", strokeWidth: 2 }}
							/>

							<Line
								type="monotone"
								dataKey="bedTime"
								stroke="#3b82f6"
								strokeWidth={3}
								name="就寝時間"
								dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
								activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
