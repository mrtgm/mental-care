import { useParams } from "react-router";
import { CalenderFooter } from "@/features/calender/components/calender-footer";
import type { Route } from "./+types/day";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `日表示 - ${params.dayId}` }, { name: "description", content: `${params.dayId}の日表示` }];
}

export default function Day() {
  const { dayId } = useParams();

  return (
    <>
      <CalenderFooter />

      <div className="py-4 rounded mt-8 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{dayId}</h2>
          <button type="button" className="text-sm text-white">
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
