import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/shadcn/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/shadcn/drawer";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import {
	WEEK_COUNT_TO_LOAD,
	WEEK_OFFSET_TO_LOAD,
} from "@/features/calender/domains/events/constants";
import {
	type CalenderEvent,
	type CalenderEventMap,
	type CalenderGrid,
	calcCalenderEventMap,
	calcGrid,
} from "@/features/calender/domains/events/domain";
import { getMonthName } from "@/utils/date";
import { debounce } from "@/utils/function";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// type: events
const calenderEvents = [
	{
		year: 2025,
		month: 5,
		date: 1,
		achievements: [],
		content: {
			message: "hooo",
		},
	},
	{
		year: 2025,
		month: 3,
		date: 23,
		achievements: [],
		content: {
			message: "yes",
		},
	},
	{
		year: 2024,
		month: 3,
		date: 23,
		achievements: [],
		content: {
			message: "yes",
		},
	},
	{
		year: 2024,
		month: 2,
		date: 23,
		achievements: [],
		content: {
			message: "yes",
		},
	},
];

export default function Home() {
	const ref = useRef<HTMLDivElement>(null);

	const [calenderState, setCalenderState] = useState<{
		calenderEvents: CalenderEvent[];
		calenderEventMap: CalenderEventMap;
		calenderGrid: CalenderGrid;
		startDate: Date;
	}>({
		calenderEvents: [],
		calenderEventMap: new Map(),
		calenderGrid: [],
		startDate: new Date(),
	});

	const [selectedDay, setSelectedDay] = useState<any>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const observerRef = useRef<IntersectionObserver | null>(null);

	const observerDomRef = useCallback(
		(node: HTMLElement | null) => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			observerRef.current = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const {
								calenderGrid: newCalenderGrid,
								startDate: updatedStartDate,
							} = calcGrid(calenderState.startDate, WEEK_COUNT_TO_LOAD);

							// Event の fetch (range) してステート更新が必要
							// loding 中なら無視とか

							const updatedCalenderEventMap = calcCalenderEventMap(
								calenderState.calenderEventMap,
								calenderState.calenderEvents,
							);

							setCalenderState(({ calenderGrid, calenderEvents }) => ({
								calenderEvents,
								calenderEventMap: updatedCalenderEventMap,
								calenderGrid: [...calenderGrid, ...newCalenderGrid],
								startDate: updatedStartDate,
							}));
						}
					});
				},
				{
					threshold: 0.1,
					rootMargin: "100px",
				},
			);

			if (!node) return;
			observerRef.current.observe(node);
		},
		[calenderState],
	);

	useEffect(() => {
		const { calenderGrid, startDate: updatedStartDate } = calcGrid(
			calenderState.startDate,
			WEEK_COUNT_TO_LOAD,
		);

		// Event の fetch (range) してステート更新が必要

		const calenderEventMap = calcCalenderEventMap(
			calenderState.calenderEventMap,
			calenderEvents,
		);

		setCalenderState(() => ({
			calenderEvents,
			calenderGrid,
			calenderEventMap,
			loadedRows: WEEK_COUNT_TO_LOAD,
			startDate: updatedStartDate,
		}));

		ref.current?.scrollTo({
			left: ref.current.scrollWidth,
		});
	}, []);

	// 日付クリック時の処理
	const handleDayClick = (day: any, content: any) => {
		if (day.dateObj > new Date()) return; // 未来の日付はクリック不可
		setSelectedDay({ ...day, content });
		setIsDrawerOpen(true);
	};

	// 仮のマークダウンコンテンツ
	const sampleMarkdown = `# Sample Markdown Content

## 概要
ここにマークダウンコンテンツが表示されます。

### 機能
- **カレンダー表示**: 日付ごとのイベントを視覚的に表示
- **マークダウン対応**: リッチテキストの表示が可能
- **レスポンシブデザイン**: 様々な画面サイズに対応

### コードブロック
\`\`\`javascript
const example = () => {
  console.log("Hello, World!");
};
\`\`\`

### リスト
1. 第一項目
2. 第二項目
3. 第三項目

### 引用
> これは引用文です。マークダウンの様々な機能を活用できます。

---

### 注意事項
- 現在は仮のコンテンツが表示されています
- 実際の使用時は動的にコンテンツを読み込みます
`;

	return (
		<TooltipProvider>
			<div className="w-full max-w-7xl mx-auto px-6 py-8 bg-white min-h-screen">
				<div className="mb-2 w-full flex items-center justify-between">
					<h1 className="text-3xl font-bold text-orange-600 mb-3">log</h1>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							className="text-orange-600 hover:bg-red-50 hover:text-orange-700 cursor-pointer"
						>
							Login
						</Button>
					</div>
				</div>

				{/* カレンダー本体 */}
				<div className="bg-white rounded-2xl border-gray-200 p-6 relative mb-8">
					<div className="absolute left-0 top-0 bottom-0 w-32 h-72 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

					<div
						className="w-full h-64 overflow-x-scroll overflow-y-visible flex flex-row-reverse
						relative gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
						ref={ref}
					>
						<AnimatePresence>
							{calenderState.calenderGrid.map((week, rowIndex, self) => {
								const isFirstWeekOfMonth = week.some((v) => v.date === 1);
								const isFirstWeekOfYear =
									isFirstWeekOfMonth &&
									week.some((v) => v.month === 1) &&
									!week.some((v) => v.month === 2);

								const isObserved =
									rowIndex + 1 === self.length - WEEK_OFFSET_TO_LOAD;

								return (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 1, ease: "easeInOut" }}
										exit={{ opacity: 0, y: -20 }}
										key={rowIndex}
										className="flex-shrink-0 w-6 h-full flex flex-col"
										{...(isObserved && { ref: observerDomRef })}
									>
										<div className="h-[40px] flex items-center justify-center mb-3">
											{isFirstWeekOfYear && (
												<span className="absolute top-0 text-sm text-orange-300">
													{week.at(0)?.year ?? 0}
												</span>
											)}
											{isFirstWeekOfMonth && (
												<span className="absolute top-[26px] text-xs text-orange-300">
													{getMonthName(week.at(0)?.month)}
												</span>
											)}
										</div>

										<div className="flex-1 flex flex-col gap-1.5">
											{week.map((day, columnIndex) => {
												const content = calenderState.calenderEventMap.get(
													`${rowIndex}:${columnIndex}`,
												);
												const hasContent = Boolean(content?.message);
												const isFutureDate = day.dateObj > new Date();

												return (
													<Tooltip key={day.dateString}>
														<TooltipTrigger asChild>
															<div
																className={`
																w-6 h-6 rounded-md border-1 transition-all duration-300
																hover:scale-110 hover:shadow-md
																${
																	isFutureDate
																		? "bg-gray-50 border-white cursor-not-allowed"
																		: hasContent
																			? "bg-orange-500 border-orange-600 hover:bg-orange-600 shadow-sm cursor-pointer"
																			: "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 cursor-pointer"
																}
															`}
																style={{ order: 7 - columnIndex }}
																onClick={() => handleDayClick(day, content)}
															></div>
														</TooltipTrigger>
														<TooltipContent
															side="top"
															className="bg-black text-white border-black"
														>
															<p className="text-xs">
																{day.year}/{day.month}/{day.date}
																{hasContent ? ` - ${content?.message}` : ""}
															</p>
														</TooltipContent>
													</Tooltip>
												);
											})}
										</div>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>

					<div className="flex items-center justify-between mt-6 pt-6 border-t-1 border-gray-200">
						<div className="flex items-center gap-3 text-sm text-gray-700">
							<div className="flex gap-1.5">
								<div className="w-4 h-4 rounded-sm bg-orange-100 border-1 border-orange-200"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-200 border-1 border-orange-300"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-400 border-1 border-orange-500"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-500 border-1 border-orange-600"></div>
								<div className="w-4 h-4 rounded-sm bg-orange-700 border-1 border-orange-800"></div>
							</div>
						</div>
					</div>
				</div>

				{/* <div className="bg-white rounded-2xl border border-gray-200 p-6">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-700">詳細</h2>
						<span className="text-sm text-gray-500">Edit</span>
					</div>

					<div className="prose prose-sm max-w-none">
						<div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
							{sampleMarkdown}
						</div>
					</div>
				</div> */}

				{/* Drawer for editing */}
				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
					<DrawerContent className="h-full max-h-[90vh] overflow-y-auto">
						<div className="mx-auto w-full max-w-sm">
							<DrawerHeader>
								<DrawerTitle>
									{selectedDay
										? `${selectedDay.year}/${selectedDay.month}/${selectedDay.date}`
										: "日付を編集"}
								</DrawerTitle>
							</DrawerHeader>

							<div className="p-4 pb-0">
								<div className="space-y-4">
									<DrawerDescription className="text-sm text-gray-600">
										日付の詳細を編集します。マークダウン形式で内容を入力してください。
									</DrawerDescription>

									<div className="space-y-2">
										<label className="block text-sm font-medium text-gray-700">
											内容
										</label>
										<textarea
											className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
											value={selectedDay?.content?.message || ""}
										/>
									</div>

									<div className="flex gap-2">
										<Button className="bg-orange-500 text-white hover:bg-orange-600 flex-1">
											Save
										</Button>
										<Button
											variant="outline"
											className="text-orange-600 border-orange-600 hover:bg-red-50 hover:text-orange-700 flex-1"
										>
											Clear
										</Button>
									</div>
								</div>
							</div>

							<DrawerFooter>
								<DrawerClose asChild>
									<button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
										キャンセル
									</button>
								</DrawerClose>
							</DrawerFooter>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</TooltipProvider>
	);
}
