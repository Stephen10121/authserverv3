<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import trashIcon from "../../assets/trash3.svg";
	import keyIcon from "../../assets/key.svg";

	const dispatch = createEventDispatcher();

	export let name: string;
	export let id: number;
</script>

<div class="website">
	<div>
		<img src={keyIcon} alt="Key" />
		<p>{name ? name : "N/A"}</p>
	</div>
	<button
		title="Delete"
		on:click={() => dispatch("delete", { id, name })}
	>
		<img src={trashIcon} alt="Delete" />
	</button>
</div>

<style>
	.website {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: rgb(119, 166, 194);
		border-radius: 5px;
		padding: 5px;
	}

	.website div {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	img {
		height: 25px;
		user-drag: none;
		-webkit-user-drag: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}

	p {
		font-family: "Poppins", sans-serif;
		font-size: 1rem;
	}

	.website button {
		cursor: pointer;
		background: none;
		border: none;
	}

	button:hover img {filter: invert(50%)}
</style>