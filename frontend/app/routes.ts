import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	layout("routes/layout.tsx", [
		index("routes/home.tsx"),
		route("weeks/:weekId", "routes/week.tsx"),
		route("days/:dayId", "routes/day.tsx"),
	]),

	route("sleeping-time", "routes/sleeping-time.tsx"),
	route("mood", "routes/mood.tsx"),
	route("achievements", "routes/achievements.tsx"),
] satisfies RouteConfig;
