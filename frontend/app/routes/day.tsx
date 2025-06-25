import { useParams } from "react-router";
import type { Route } from "./+types/day";

export function meta({ params }: Route.MetaArgs) {
	return [
		{ title: `日表示 - ${params.dayId}` },
		{ name: "description", content: `${params.dayId}の日表示` },
	];
}

export default function Day() {
	const { dayId } = useParams();

	return (
		<div className="p-4 bg-purple-50 rounded">
			<h2 className="text-xl font-bold mb-2">日表示</h2>
			<p>日付: {dayId}</p>
			<p>この日の詳細情報やイベントを表示</p>
		</div>
	);
}
