import type { SetURLSearchParams } from "react-router";
import type { TargetType } from "../domain";

export const GraphFooter = ({ setSearchParams }: { setSearchParams: SetURLSearchParams }) => {
  const graphTypes: { color: string; value: TargetType }[] = [
    {
      color: "#007bff",
      value: "bedtime",
    },
    {
      color: "#dc3545",
      value: "wakeuptime",
    },
    {
      color: "#ffc0cb",
      value: "mood",
    },
  ];

  return (
    <div className="flex items-center justify-between pt-6 border-t-1 border-gray-200">
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <div className="flex gap-1.5">
          {graphTypes.map((type) => (
            <button type="button" key={type.value} className="w-4 h-4 cursor-pointer" style={{ backgroundColor: type.color }} onClick={() => setSearchParams({ target: type.value })} />
          ))}
        </div>
      </div>
    </div>
  );
};
