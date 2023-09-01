<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Add2fa from "./Add2fa.svelte";
	import { invalidateAll } from "$app/navigation";
	let showAdd = false;
</script>

{#if showAdd}
	<section>
		<div>
			<Add2fa
				on:cancel={() => showAdd = false}
				on:success={() => {invalidateAll();showAdd = false;}}
			/>
		</div>
	</section>
{/if}
<button on:click={() => showAdd = true}>Add 2fa method</button>

<style>
	button {
		width: 100%;
		height: 40px;
		cursor: pointer;
		border-radius: 5px;
		background-color: rgb(119, 166, 194);
		font-family: "Poppins", sans-serif;
		border: none !important;
		padding: 5px;
		font-size: 1rem;
	}

	button:hover {background-color: rgb(101, 144, 168)}

	section {
		position: fixed;
		top: 70px;
		left: 0;
		width: 100vw;
		height: calc(100vh - 70px);
		height: calc(100dvh - 70px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	section div {
		width: 60%;
		height: 60%;
		max-width: 850px;
		background-color: white;
		border-radius: 10px;
	}
</style>