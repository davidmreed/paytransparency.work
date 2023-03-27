export const sortByBoolean = (a: boolean, b: boolean) => (a !== b ? (a ? -1 : 1) : 0);
export const sortByCriteria = <T>(criteria: ((a: T, b: T) => 0 | 1 | -1)[]) => {
	return function (a: T, b: T) {
		for (const criterion of criteria) {
			const result = criterion(a, b);
			if (result !== 0) {
				return result;
			}
		}
		return 0;
	};
};
