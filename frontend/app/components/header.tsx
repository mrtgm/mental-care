import { Link } from "react-router";
import { Button } from "./shadcn/button";

export const Header = () => {
  return (
    <div className="mb-2 w-full flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white mb-3">log</h1>

      <div className="flex items-center gap-2">
        <div className="rounded-lg flex items-center justify-center text-gray-500 transition-colors p-2 px-4 gap-4">
          <Link to="/">top</Link>
          <Link to="/graph">graph</Link>
          <Link to="/achievements">achievements</Link>
        </div>

        <Button variant="ghost" className="text-white cursor-pointer">
          Login
        </Button>
      </div>
    </div>
  );
};
