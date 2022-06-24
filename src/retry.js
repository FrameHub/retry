
function _sleep(time) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), time)
	})
}

const MSG = {
	ARG_VALIDATOR__FN: '[Retry] argument `validator` is not a function',
	ARG_ATTEMPTS__INT: '[Retry] argument `attempts` must be an integer',
	ARG_ATTEMPTS__POS: '[Retry] argument `attempts` must be greater than 0',
	ARG_INTERVAL__NUM: '[Retry] argument `interval` must be a number',
	ARG_INTERVAL__POS: '[Retry] argument `interval` must be greater than 0',
}

/**
 * 一个简单的重试方法
 * @param {function} validator 函数或异步函数，检查器，判断是否满足检查条件
 * @param {Object} options 重试参数
 * - options.attempts {number} 最大重试次数，默认5次
 * - options.interval {number} 重试间隔(毫秒)，默认10秒
 * - options.name {string} 为当前重试任务起个名字；如未提供，则会自动生成一个唯一 ID
 * - options.debug {boolean} 是否调试模式。调试模式会输出更多日志
 */
async function retry(validator, {
	attempts = 5,
	interval = 10000,
	name = '',
	debug = false,
} = {}) {

	if (typeof validator !== 'function') {
		throw Error(MSG.ARG_VALIDATOR__FN)
	}
	if (!Number.isInteger(attempts)) {
		throw Error(MSG.ARG_ATTEMPTS__INT)
	}
	if (attempts < 0) {
		throw Error(MSG.ARG_ATTEMPTS__POS)
	}
	if (typeof interval !== 'number') {
		throw Error(MSG.ARG_INTERVAL__NUM)
	}
	if (interval < 0) {
		throw Error(MSG.ARG_INTERVAL__POS)
	}

	// debug
	const random = Math.random().toString(36).slice(2, 8)
	name = String(name) || 'retry-' + random

	let times = 0
	let result
	do {
		result = await validator()
		times++
		await _sleep(interval)

		// debug
		if (debug) console.log(`[Retry] trying "${name}" #${times} and get result:`, result)

	} while (times <= attempts && !result)

	if (result) {
		// debug
		if (debug) console.log(`[Retry] tried ${times} time(s) and succeeded`)

		return result
	} else {
		throw new Error(`[Retry] tried ${times} time(s) and failed`)
	}
}

module.exports = retry

// for testing
retry.__MSG = MSG
