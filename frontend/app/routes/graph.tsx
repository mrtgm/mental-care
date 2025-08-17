import { useSearchParams } from "react-router";
import { Header } from "@/components/header";
import { sampleEvents } from "@/data/dummy-events";
import { Graph } from "@/features/graph/components/graph";
import { GraphFooter } from "@/features/graph/components/graph-footer";
import { DateStringSchema, TargetTypeSchema } from "@/features/graph/domain";
import { useStore } from "@/store";
import { formatDate } from "@/utils/date";
import type { Route } from "./+types/week";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Sleeping Time` }];
}

export default function SleepingTime() {
  const [searchParams, setSearchParams] = useSearchParams();

  const calenderStore = useStore.useSlice.calender();

  const target = TargetTypeSchema.parse(searchParams.get("target") || "bedtime");
  const dateString = DateStringSchema.parse(searchParams.get("date") || formatDate(new Date()));

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen sm:max-w-full">
      <div className="px-6 py-8">
        <Header />
      </div>
      <div className="rounded-2xl border-gray-200 px-6 mb-8 sm:px-0">
        <div className="left-0 top-0 bottom-0 w-full pl-6">
          <Graph events={calenderStore.events} target={target} dateString={dateString} />
        </div>
        <div className="px-6">
          <GraphFooter setSearchParams={setSearchParams} />
        </div>
      </div>
    </div>
  );
}
