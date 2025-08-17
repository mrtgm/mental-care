import { sampleMarkdown } from "@/data/dummy-text";

export const EventDetial = () => {
  return (
    <div className="py-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">詳細</h2>
        <span className="text-sm">Edit</span>
      </div>

      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed">{sampleMarkdown}</div>
      </div>
    </div>
  );
};
