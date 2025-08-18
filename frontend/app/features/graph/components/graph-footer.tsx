import { BEDTIME_COLOR, MOOD_COLOR, type TargetType, WAKEUP_COLOR } from "../domain";

export const GraphFooter = ({ handleGraphTypeChange }: { handleGraphTypeChange: (type: TargetType) => void }) => {
  const graphTypes: { color: string; value: TargetType }[] = [
    {
      color: BEDTIME_COLOR,
      value: "bedtime",
    },
    {
      color: WAKEUP_COLOR,
      value: "wakeuptime",
    },
    {
      color: MOOD_COLOR,
      value: "mood",
    },
  ];

  return (
    <div className="flex items-center justify-between pt-6 border-t-1 border-gray-200">
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <div className="flex gap-1.5">
          {graphTypes.map((type) => (
            <button type="button" key={type.value} className="w-4 h-4 cursor-pointer" style={{ backgroundColor: type.color }} onClick={() => handleGraphTypeChange(type.value)} />
          ))}
        </div>
      </div>
    </div>
  );
};
