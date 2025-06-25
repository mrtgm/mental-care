import { enableMapSet } from "immer";
import { StaticRouter } from "react-router";
import {
	create,
	type StateCreator,
	type StoreApi,
	type UseBoundStore,
} from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
	type CalenderSlice,
	createCalenderSlice,
} from "@/features/calender/store/calender";

const sliceDefinitions = {
	calender: createCalenderSlice,
};

export type AppState = CalenderSlice;

type StoreWithSliceSelectors<S> = S & {
	useSlice: {
		[K in keyof typeof sliceDefinitions]: () => ReturnType<
			(typeof sliceDefinitions)[K]
		>;
	};
} & StoreApi<AppState>;

const createSelector = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S,
) => {
	enableMapSet();

	const store = _store as StoreWithSliceSelectors<typeof _store>;
	store.useSlice = {} as StoreWithSliceSelectors<typeof _store>["useSlice"];

	const sliceKeysCache = new Map<string, string[]>();

	// 初期化時に一度だけそのスライスのキーを抽出してキャッシュ
	for (const [sliceName, sliceCreator] of Object.entries(sliceDefinitions)) {
		const sliceResult = sliceCreator(
			() => {},
			() => (() => {}) as any,
			{} as any,
		);
		const keys = Object.keys(sliceResult);
		sliceKeysCache.set(sliceName, keys);
	}

	// 抽出したキーを下にストアを分割、selector を作成
	for (const sliceName of Object.keys(sliceDefinitions)) {
		const sliceKeys = sliceKeysCache.get(sliceName) || [];

		(store.useSlice as any)[sliceName] = () =>
			Object.assign({}, store.getState(), {
				...sliceKeys.map((key) => ({
					[key]: store((state) => (state as any)[key]),
				})),
			});
	}

	return store;
};

export const useStore = createSelector(
	create<
		AppState,
		[
			["zustand/devtools", never],
			["zustand/subscribeWithSelector", never],
			["zustand/immer", never],
		]
	>(
		devtools(
			subscribeWithSelector(
				immer((set, get, store) => {
					const slices = Object.entries(sliceDefinitions).map(
						([_, createSlice]) => createSlice(set, get, store),
					);
					return Object.assign({}, ...slices);
				}),
			),
		),
	),
);
