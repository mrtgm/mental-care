import { sampleMarkdown } from "@/data/dummy-text";

export const EventDetial = () => {
	return (
		<div className="bg-white rounded-2xl border border-gray-200 p-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-semibold text-gray-700">詳細</h2>
				<span className="text-sm text-gray-500">Edit</span>
			</div>

			<div className="prose prose-sm max-w-none">
				<div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
					{sampleMarkdown}
				</div>
			</div>
		</div>
	);
};
