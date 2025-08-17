import { CalenderFooter } from "@/features/calender/components/calender-footer";

export function meta() {
  return [{ title: "カレンダー - ホーム" }, { name: "description", content: "カレンダーのホームページ" }];
}

export default function Home() {
  return (
    <div>
      <CalenderFooter />
    </div>
  );
}
