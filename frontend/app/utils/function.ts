type GenericFunction<Args extends unknown[], Return> = (...args: Args) => Return;

export const debounce = <T extends unknown[], R>(func: GenericFunction<T, R>, wait: number): ((args: T) => void) => {
  let timeout: NodeJS.Timeout | number | null = null;
  return (args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const groupBy = <T, K extends keyof T>(data: T[], key: K): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};
  data.forEach((item) => {
    const keyValue = String(item[key]);
    if (!grouped[keyValue]) {
      grouped[keyValue] = [];
    }
    grouped[keyValue].push(item);
  });
  return grouped;
};
