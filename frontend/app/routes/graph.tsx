import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { data, useParams } from "react-router";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Header } from "@/components/header";
import { sampleEvents } from "@/data/dummy-events";
import type { CalenderEvent } from "@/features/calender/domains/events/domain";
import { Graph } from "@/features/graph/components/graph";
import { XPane } from "@/features/graph/components/x-pane";
import { YPane } from "@/features/graph/components/y-pane";
import { PLOT_AREA } from "@/features/graph/constants";
import { convertTimeToMs, getMsFromMonthEnd, getMsOfMonth } from "@/utils/date";
import { floorToPrecision } from "@/utils/math";
import type { Route } from "./+types/week";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Sleeping Time` }];
}

export default function SleepingTime() {
  const { weekId } = useParams();

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen sm:max-w-full">
      <div className="px-6 py-8">
        <Header />
      </div>
      <div className="rounded-2xl border-gray-200 p-6 relative mb-8 sm:px-0">
        <div className="absolute left-0 top-0 bottom-0 w-full h-72">
          <Graph events={sampleEvents} />
        </div>
      </div>
    </div>
  );
}
