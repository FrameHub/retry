import retry from '../src/retry'

describe('retry test',  ()=>{
	test('validator is not a function', async ()=>{
		expect.assertions(1)
		await expect(retry()).rejects.toThrow('validator is not a function')
	})
	test('retries is not a integer', async ()=>{
		expect.assertions(1)
		await expect(retry(function () {}, {
			retries: 1.1,
			timeout: 0,
		})).rejects.toThrow('retries parameter type must be integer')
	})
	test('retries < 0', async ()=>{
		expect.assertions(1)
		await expect(retry(function () {}, {
			retries: -1,
			timeout: 0,
		})).rejects.toThrow('retries must greater than 0')
	})
	test('timeout is not a number', async ()=>{
		expect.assertions(1)
		await expect(retry(function () {}, {
			retries: 1,
			timeout: 'asd',
		})).rejects.toThrow('timeout parameter type must be number')
	})
	test('timeout < 0', async ()=>{
		expect.assertions(1)
		await expect(retry(function () {}, {
			retries: 1,
			timeout: -123,
		})).rejects.toThrow('timeout must greater than 0')
	})
	test('validator return true', async ()=>{
		expect.assertions(1)
		await expect(retry(function () {
			return true
		}, {
			retries: 1,
			timeout: 0,
		})).resolves.toBe('retrying successed')
	})
	test('validator return false', async ()=>{
		expect.assertions(1)
		await expect(retry(function () {
			return false
		}, {
			retries: 1,
			timeout: 0,
		})).rejects.toThrow('retrying failed')
	})
})

