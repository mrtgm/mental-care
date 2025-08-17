import { useEffect, useRef } from "react";

export type UseResizeCallbackArgs = {
  width: number;
  height: number;
  isScaleUp: boolean;
};

export const useResize = (callback: (args: UseResizeCallbackArgs) => void) => {
  const preWidth = useRef(0);
  const preHeight = useRef(0);

  useEffect(() => {
    const handleResize = (event?: Event) => {
      if (event && event.target !== window) return;

      const args: UseResizeCallbackArgs = {
        width: window.innerWidth,
        height: window.innerHeight,
        isScaleUp: false,
      };

      if (event && preWidth.current) {
        const target = event.target as Window;
        args.isScaleUp = target.innerWidth > preWidth.current || target.innerHeight > preHeight.current;
      }

      callback(args);

      preWidth.current = window.innerWidth;
      preHeight.current = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [callback]);
};
