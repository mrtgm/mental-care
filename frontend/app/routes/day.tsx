import { useParams } from "react-router";
import { CalenderFooter } from "@/features/calender/components/calender-footer";
import { EventDetail } from "@/features/event/components/detail";
import type { Route } from "./+types/day";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `日表示 - ${params.dayId}` }, { name: "description", content: `${params.dayId}の日表示` }];
}

export default function Day() {
  const { dayId } = useParams();

  return (
    <>
      <CalenderFooter />

      <div className=" p-6 border border-[#3f485a] bg-[#08101b]  mt-8">
        <div className="text-white">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{dayId}</h2>

            {/* TODO: ここに擬似的にイベント詳細のビューワ作る */}

            <button type="button" className="text-sm text-white">
              Edit
            </button>
          </div>
        </div>

        <div className="mt-6">
          <EventDetail />
        </div>
      </div>
    </>
  );
}
