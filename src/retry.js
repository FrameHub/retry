function _sleep(time) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), time)
	})
}
/**
 *
 * @param {function} validator 函数或异步函数，检查器，判断是否满足检查条件
 * @param {object} param1 重试参数
 * - retries - {Number} 最大重试次数，默认5次
 * - timeout - {Number} 重试间隔(毫秒)，默认10秒
 */
module.exports = async function retry(validator, {
	retries = 5,
	timeout = 10000,
} = {}) {

	if (typeof validator !== 'function') {
		throw Error('validator is not a function')
	}
	if (!Number.isInteger(retries)) {
		throw Error('retries parameter type must be integer')
	}
	if (retries < 0) {
		throw Error('retries must greater than 0')
	}
	if (typeof timeout !== 'number') {
		throw Error('timeout parameter type must be number')
	}
	if (timeout < 0) {
		throw Error('timeout must greater than 0')
	}

	let times = 0
	let result
	do {
		result = await validator()
		times++
		await _sleep(timeout)
	} while (times <= retries && !result)

	if (result) {
		return 'retrying successed'
	} else {
		throw new Error('retrying failed')
	}
}
