import retry from '../src/retry'

const MSG = retry.__MSG

describe('retry()', () => {
	describe('args', () => {
		test('quit if `validator` is not a function', async () => {
			expect.assertions(1)
			await expect(retry()).rejects.toThrow(MSG.ARG_VALIDATOR__FN)
		})
		test('quit if `attempts` is not an integer', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				attempts: 1.1,
				interval: 0,
			})).rejects.toThrow(MSG.ARG_ATTEMPTS__INT)
		})
		test('quit if `attempts` < 0', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				attempts: -1,
				interval: 0,
			})).rejects.toThrow(MSG.ARG_ATTEMPTS__POS)
		})
		test('quit if `interval` is not a number', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				attempts: 1,
				interval: 'asd',
			})).rejects.toThrow(MSG.ARG_INTERVAL__NUM)
		})
		test('quit if `interval` < 0', async () => {
			expect.assertions(1)
			await expect(retry(function () {}, {
				attempts: 1,
				interval: -123,
			})).rejects.toThrow(MSG.ARG_INTERVAL__POS)
		})
	})

	describe('fn', () => {
		test('if `validator` returns true', async () => {
			expect.assertions(1)
			await expect(retry(function () {
				return true
			}, {
				attempts: 1,
				interval: 0,
				debug: true,
			})).resolves.toBeTruthy()
		})
		test('if `validator` returns false', async () => {
			expect.assertions(1)
			await expect(retry(function () {
				return false
			}, {
				attempts: 1,
				interval: 0,
				debug: true,
			})).rejects.toThrow()
		})
	})

	// TODO
	// check quantity of retrying
})

