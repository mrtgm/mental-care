import { Button } from "./shadcn/button";

export const Header = () => {
	return (
		<div className="mb-2 w-full flex items-center justify-between">
			<h1 className="text-3xl font-bold text-orange-600 mb-3">📝 log</h1>

			<div className="flex items-center gap-2">
				<div className="rounded-lg bg-white flex items-center justify-center text-gray-500 transition-colors border border-gray-200 p-2 px-4 gap-4">
					<span>📝</span>
					<span>🛌</span>
					<span>🎵</span>
					<span>✨️</span>
				</div>

				<Button
					variant="ghost"
					className="text-orange-600 hover:bg-red-50 hover:text-orange-700 cursor-pointer"
				>
					Login
				</Button>
			</div>
		</div>
	);
};
