// Promise.withResolvers polyfill
if (typeof Promise.withResolvers !== 'function') {
	Promise.withResolvers = function () {
		let resolve, reject;
		const promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return { promise, resolve, reject };
	};
}
