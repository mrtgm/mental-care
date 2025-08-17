import { useParams } from "react-router";
import type { Route } from "./+types/week";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `週表示 - ${params.weekId}` }, { name: "description", content: `${params.weekId}の週表示` }];
}

export default function Week() {
  const { weekId } = useParams();

  return (
    <div className="py-4 text-white">
      <h2 className="text-xl font-bold mb-2">週表示</h2>
      <p>週ID: {weekId}</p>
      <p>この週の詳細情報やイベントを表示</p>
    </div>
  );
}
