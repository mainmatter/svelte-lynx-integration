<svelte:options customRenderer="./renderer.js" />

<script>
	let { todo, ontoggle } = $props();
</script>

<view class="todo" onbindtap={ontoggle}>
	<text class="todo-text">{todo.todo}</text>{#if todo.done}<text
			class="todo-text">✅</text
		>{/if}
</view>

<style>
	.todo {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}
	.todo-text {
		font-size: 40rpx;
		font-family: monospace;
		font-weight: bold;
	}
</style>
