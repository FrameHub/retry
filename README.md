# Retry

> A "Simple and Stupid" retry function.


## 背景

有时候，我们需要重复执行某个动作，直到结果达到预期。比如我们在等待某个耗时操作的完成，如果它没有提供回调的话，我们就需要有一套重试机制来轮询预期结果是否已经达成。再比如某个操作就是需要重复多次才有可能成功，我们也需要重试多次并检查操作结果。

为满足上述需求，我们创建了 Retry 这个小项目。Retry 允许我们指定重试次数和重试间隔，帮我们定时调用检查器函数，并通过 Promise 来告知最终的检查结果。


## 功能

函数签名：

```js
retry(
	validator, // [函数或异步函数] 检查器，判断是否满足检查条件
	{
		interval, // [数字] 重试间隔，单位毫秒
		attempts, // [数字] 最大重试次数
	}
)
```

主要行为：

* 返回一个 Promise。
* 如果在指定的次数内重试成功，则 Promise resolve。
* 如果在指定的次数内重试失败，则 Promise reject。
* 如果 `attempts` 是 N，则 `validator` 最多会被调用 1+N 次。


## 使用方法

安装：

```sh
npm install @framehub/retry
```

应用示例：

```js
const retry = require('@framehub/retry')

// 定义检查器
function checkStatus() {
	// 假设可以通过 `taskStatus` 这个变量来读取任务状态
	return taskStatus === 'done'
}

// 启动重试行为
retry(checkStatus, {
	interval: 1000,  // 每秒检查一次
	attempts: 8,     // 最多重试 8 次
})
	.then(() => {
		// 如果在指定次数内检查通过，进入这里
	})
	.catch(() => {
		// 如果未能在指定次数内检查通过，进入这里
	})
```


***

## License

MIT
