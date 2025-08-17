import { NavLink } from "react-router";
import { Button } from "./shadcn/button";

export const Header = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white mb-3">log</h1>
      <div className="flex items-center gap-2">
        <div className="rounded-lg flex items-center justify-center text-gray-500 transition-colors p-2 px-4 gap-4">
          <NavLink to="/" className={({ isActive }) => (isActive ? "underline" : "")}>
            top
          </NavLink>
          {/* TODO: diaryビュー（今のブログみたいなやつ）を用意する */}
          <NavLink to="/diary" className={({ isActive }) => (isActive ? "underline" : "")}>
            diary
          </NavLink>
          <NavLink to="/graph" className={({ isActive }) => (isActive ? "underline" : "")}>
            graph
          </NavLink>
          <NavLink to="/achievements" className={({ isActive }) => (isActive ? "underline" : "")}>
            achievements
          </NavLink>
        </div>
        <Button variant="ghost" className="text-white cursor-pointer">
          Login
        </Button>
      </div>
    </div>
  );
};
