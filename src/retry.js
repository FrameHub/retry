
function _sleep(time) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), time)
	})
}

/**
 * 一个简单的重试方法
 * @param {function} validator 函数或异步函数，检查器，判断是否满足检查条件
 * @param {Object} options 重试参数
 * - options.retries {Number} 最大重试次数，默认5次
 * - options.timeout {Number} 重试间隔(毫秒)，默认10秒
 */
module.exports = async function retry(validator, {
	retries = 5,
	timeout = 10000,
} = {}) {

	if (typeof validator !== 'function') {
		throw Error('[Retry] argument `validator` is not a function')
	}
	if (!Number.isInteger(retries)) {
		throw Error('[Retry] argument `retries` must be an integer')
	}
	if (retries < 0) {
		throw Error('[Retry] argument `retries` must be greater than 0')
	}
	if (typeof timeout !== 'number') {
		throw Error('[Retry] argument `timeout` must be a number')
	}
	if (timeout < 0) {
		throw Error('[Retry] argument `timeout` must be greater than 0')
	}

	let times = 0
	let result
	do {
		result = await validator()
		times++
		await _sleep(timeout)
	} while (times <= retries && !result)

	if (result) {
		return `[Retry] tried ${times} time(s) and succeeded`
	} else {
		throw new Error(`[Retry] tried ${times} time(s) and failed`)
	}
}
