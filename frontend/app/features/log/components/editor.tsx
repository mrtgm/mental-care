import { Button } from "@/components/shadcn/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/shadcn/drawer";

export const LogEditor = ({
	selectedDay,
	isDrawerOpen,
	setIsDrawerOpen,
}: {
	selectedDay: any;
	isDrawerOpen: boolean;
	setIsDrawerOpen: (open: boolean) => void;
}) => {
	if (!selectedDay) {
		return null; // 選択されていない場合は何も表示しない
	}

	return (
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
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700">
									Content
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
								Cancel
							</button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
