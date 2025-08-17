import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [index("routes/home.tsx"), route("weeks/:weekId", "routes/week.tsx"), route("days/:dayId", "routes/day.tsx")]),

  route("achievements", "routes/achievements.tsx", { id: "achievements-list" }),
  route("achievements/:id", "routes/achievements.tsx", { id: "achievements-detail" }),
  route("graph", "routes/graph.tsx"),
] satisfies RouteConfig;
