import { Link, useParams } from "react-router";
import type { Achievement } from "@/features/calender/domains/events/domain";
import { groupBy } from "@/utils/function";
import { achievementsMaster } from "../data/dummy-achievements"; // Assuming you have a data file with sample achievements
import type { Route } from "./+types/day";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Achievements - ${params.dayId}` }, { name: "description", content: `${params.dayId}の日表示` }];
}

export default function Achievements() {
  const achievementsByType = groupBy(achievementsMaster as Achievement[], "type");

  return (
    <div className="text-white mt-6 pt-6 border-t-1 border-gray-200">
      <div className="flex items-start gap-20 mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Positive</h2>

          <ul className="list-disc pl-6 mb-8 underline">
            {achievementsByType.positive
              ?.sort((a, b) => b.score - a.score)
              .map((achievement) => (
                <div key={achievement.id} className="mb-2">
                  <Link to={`/achievements?achievementId=${achievement.id}`}>
                    <span className="font-semibold">{achievement.label}</span>
                  </Link>
                </div>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Negative</h2>

          <ul className="list-disc pl-6 underline">
            {achievementsByType.negative
              ?.sort((a, b) => b.score - a.score)
              .map((achievement) => (
                <div key={achievement.id} className="mb-2">
                  <Link to={`/achievements?achievementId=${achievement.id}`}>
                    <span className="font-semibold">{achievement.label}</span>
                  </Link>
                </div>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
