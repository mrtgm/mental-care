import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { Header } from "@/components/header";
import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { Graph } from "@/features/graph/components/graph";
import { GraphFooter } from "@/features/graph/components/graph-footer";
import { DateStringSchema, type TargetType, TargetTypeSchema } from "@/features/graph/domain";
import { useStore } from "@/store";
import { formatDate } from "@/utils/date";
import type { Route } from "./+types/week";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Graph View` }];
}

export default function GraphView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const calenderStore = useStore.useSlice.calender();

  const target = TargetTypeSchema.parse(searchParams.get("target") || "bedtime");
  const dateString = DateStringSchema.parse(searchParams.get("eventId") || formatDate(new Date()));

  const handleClickDataPoint = useCallback(
    (event: CalenderEvent) => {
      setSearchParams({ eventId: event.id, target });
    },
    [setSearchParams, target],
  );

  const handleGraphTypeChange = useCallback(
    (type: TargetType) => {
      setSearchParams({ target: type, eventId: dateString });
    },
    [setSearchParams, dateString],
  );

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen sm:max-w-full">
      <div className="px-6 pt-8">
        <Header />
      </div>
      <div className="rounded-2xl border-gray-200 mt-10">
        <div className="left-0 top-0 bottom-0 w-full pl-6">
          <Graph events={calenderStore.events} target={target} dateString={dateString} handleClickDataPoint={handleClickDataPoint} />
        </div>
        <div className="px-6">
          <GraphFooter handleGraphTypeChange={handleGraphTypeChange} />
        </div>
      </div>
    </div>
  );
}
