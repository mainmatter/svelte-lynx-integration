<svelte:options customRenderer="./renderer.js" />

<script>
	import Todo from './Todo.svelte';
	let todo = $state('');
	let todos = $state([]);
</script>

<view class="main">
	{#key todos.length}
		<image
			src="https://github.com/sveltejs/branding/blob/master/svelte-logo-square.png?raw=true"
		></image>
	{/key}
	<view class="add">
		<text class="title">Svelte + Lynx Todo</text>
		<view class="input">
			<input
				onbindinput={(e) => {
					todo = e.detail.value;
				}}
			/>
			<view
				onbindtap={() => {
					if (todo) {
						todos.push({ todo, done: false });
					}
				}}
				class="button"><text>Add</text></view
			>
		</view>
	</view>
	<view class="each">
		{#each todos as todo, index}
			<Todo
				{todo}
				ontoggle={() => {
					todo.done = !todo.done;
				}}
			/>
		{/each}
	</view>
</view>

<style>
	.main {
		display: grid;
		grid-template-rows: auto auto 1fr;
		align-items: center;
		justify-items: center;
		height: 100vh;
		background: linear-gradient(45deg, #ff3e00 0%, white 70%, #ff3e00 100%);
		gap: 40rpx;
		padding-top: 10vh;
	}
	image {
		width: 240rpx;
		height: 240rpx;
		border-radius: 64rpx;
		justify-self: center;
		animation: rotate 500ms;
	}
	.title {
		font-size: 50rpx;
		margin-bottom: 20rpx;
		font-weight: bold;
		font-family: monospace;
		text-align: center;
		align-self: center;
	}
	.input {
		display: grid;
		grid-template-columns: 1fr auto;
		width: 80vw;
	}
	.button {
		background-color: #ff3e00;
		color: white;
		padding: 16rpx;
		border-top-right-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
	input {
		border: 1rpx solid #ccc;
		background-color: white;
		padding-left: 16rpx;
		padding-right: 16rpx;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}
	.each {
		align-self: start;
		display: grid;
		align-items: start;
		justify-items: start;
		width: 80vw;
		gap: 16px;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
