export const GraphFooter = () => {
  // ここは色々現在選択中のログタイプによって変わる
  return (
    <div className="flex items-center justify-between pt-6 border-t-1 border-gray-200">
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <div className="flex gap-1.5">
          {[20, 40, 60, 80, 100].map((percentage) => (
            <div key={percentage} className="w-4 h-4" style={{ backgroundColor: "white" }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
