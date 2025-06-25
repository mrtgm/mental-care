import { useEffect } from "react";
import { sampleEvents } from "@/data/dummy-events";
import { useStore } from "@/store";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "カレンダー - ホーム" },
		{ name: "description", content: "カレンダーのホームページ" },
	];
}

export default function Home() {
	return (
		<div className="p-4 bg-blue-50 rounded">
			<h2 className="text-xl font-bold mb-2">ホーム表示</h2>
			<p>メインのカレンダー表示です</p>
		</div>
	);
}
