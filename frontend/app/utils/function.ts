type GenericFunction<Args extends unknown[], Return> = (
	...args: Args
) => Return;

export const debounce = <T extends unknown[], R>(
	func: GenericFunction<T, R>,
	wait: number,
): ((args: T) => void) => {
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
