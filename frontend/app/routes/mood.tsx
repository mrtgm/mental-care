import { useParams } from "react-router";
import type { Route } from "./+types/day";

export function meta({ params }: Route.MetaArgs) {
	return [
		{ title: `Mood - ${params.dayId}` },
		{ name: "description", content: `${params.dayId}の日表示` },
	];
}

export default function Mood() {
	const { dayId } = useParams();

	return (
		<div className="p-4 bg-purple-50 rounded">
			<p>Mood: {dayId}</p>
		</div>
	);
}
