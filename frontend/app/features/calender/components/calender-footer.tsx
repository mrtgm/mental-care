export const CalenderFooter = () => {
	// ここは色々現在選択中のログタイプによって変わる
	return (
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
	);
};
