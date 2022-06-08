import retry from '../src/retry'

const MSG = retry.__MSG

describe('retry()', () => {
	describe('args', () => {
		test('quit if `validator` is not a function', async () => {
			expect.assertions(1)
			await expect(retry()).rejects.toThrow(MSG.ARG_VALIDATOR__FN)
		})
		test('quit if `retries` is not an integer', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				retries: 1.1,
				timeout: 0,
			})).rejects.toThrow(MSG.ARG_RETRIES__INT)
		})
		test('quit if `retries` < 0', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				retries: -1,
				timeout: 0,
			})).rejects.toThrow(MSG.ARG_RETRIES__POS)
		})
		test('quit if `timeout` is not a number', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				retries: 1,
				timeout: 'asd',
			})).rejects.toThrow(MSG.ARG_TIMEOUT__NUM)
		})
		test('quit if `timeout` < 0', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				retries: 1,
				timeout: -123,
			})).rejects.toThrow(MSG.ARG_TIMEOUT__POS)
		})
	})

	describe('fn', () => {
		test('if `validator` returns true', async () => {
			expect.assertions(1)
			await expect(retry(function () {
				return true
			}, {
				retries: 1,
				timeout: 0,
			})).resolves.toBeTruthy()
		})
		test('if `validator` returns false', async () => {
			expect.assertions(1)
			await expect(retry(function () {
				return false
			}, {
				retries: 1,
				timeout: 0,
			})).rejects.toThrow()
		})
	})

	// TODO
	// check quantity of retrying
})

