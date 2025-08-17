import { useEffect } from "react";
import { sampleEvents } from "@/data/dummy-events";
import { useStore } from "@/store";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "カレンダー - ホーム" }, { name: "description", content: "カレンダーのホームページ" }];
}

export default function Home() {
  return <div />;
}
