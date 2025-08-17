import type { StateCreator } from "zustand";
import type { AppState } from "@/store";
import type { CalenderEvent, CalenderEventMap, CalenderGrid, CalenderWeekEvent, GridDay } from "../domains/events/domain";

export interface CalenderSlice {
  // TODO: この辺、グリッドに関することとカレンダーに関することを分離したほうがいい
  events: CalenderEvent[];
  setEvents: (events: CalenderEvent[]) => void;
  addEvent: (event: CalenderEvent) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (event: CalenderEvent) => void;

  weekEvents: CalenderWeekEvent[];
  setWeekEvents: (weekEvents: CalenderWeekEvent[]) => void;

  // eventMap: CalenderEventMap;
  // setEventMap: (eventMap: CalenderEventMap) => void;

  // calenderGrid: CalenderGrid;
  // setCalenderGrid: (calenderGrid: CalenderGrid) => void;

  count: number;
  incrementCount: () => void;
}

export const createCalenderSlice: StateCreator<AppState, [["zustand/devtools", never], ["zustand/immer", never], ["zustand/subscribeWithSelector", never]], [], CalenderSlice> = (set) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== eventId),
    })),
  updateEvent: (event) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === event.id ? { ...e, ...event } : e)),
    })),

  weekEvents: [],
  setWeekEvents: (weekEvents) => set({ weekEvents }),

  // eventMap: new Map(),
  // setEventMap: (eventMap) => set({ eventMap }),

  // calenderGrid: [],
  // setCalenderGrid: (calenderGrid) => set({ calenderGrid }),

  count: 1,
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
});
