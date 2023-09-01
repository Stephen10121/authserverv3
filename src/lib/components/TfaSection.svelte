<script lang="ts">
	import Key from "./Key.svelte";
	import AddKey from "./AddKey.svelte";
	import ExtraInfo from "./ExtraInfo.svelte";
	import { invalidateAll } from "$app/navigation";
	import BoolPrompt from "./BoolPrompt.svelte";
	import { notification } from "../../stores/notification";
	export let tfa: string;
	export let tfaKeys: {id: number, name: string}[];
	let deleteIt: null | { id: number, name: string } = null;

	async function deleteKey() {
		const verificationResp = await fetch("/api/deleteKey", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			//@ts-ignore
			body: JSON.stringify({ id: deleteIt.id, name: deleteIt.name }),
		});

		if (verificationResp.status !== 200) {
			notification.update((notify) => {
				notify.push({
					type: "error",
					message: "Error deleting key."
				});
				return notify
			});
		} else {
			notification.update((notify) => {
				notify.push({
					type: "success",
					message: "Deleted the key."
				});
				return notify
			});
			invalidateAll();
		}

		deleteIt = null;
	}
</script>

{#if deleteIt}
	<BoolPrompt on:close={() => deleteIt = null} on:answer={deleteKey} />
{/if}
<div class="twofactor">
	<ExtraInfo>Add a second layer of protection with biometrics or security key.</ExtraInfo>
	<p class="title">2 factor authentication</p>
	{#each tfaKeys as key}
		<Key name={key.name} id={key.id} on:delete={({ detail }) => deleteIt = detail} />
	{/each}
	<AddKey />
	{#if !tfa}
		<div class="blackout"><h1>Disabled</h1></div>
	{/if}
</div>

<style>
	.twofactor {
		width: 100%;
		min-height: 100px;
		box-shadow: var(--shadow);
		position: relative;
		padding: 45px 10px 10px 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 5px;
	}

	.blackout {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.25);
		position: absolute;
		border-radius: 5px;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.blackout h1 {
		color: red;
		text-transform: uppercase;
		font-family: sans-serif;
		display: inline-block;
		border: 2px solid red;
		padding: 5px;
	}

	.title {
		position: absolute;
		top: 10px;
		left: 10px;
		font-family: "Roboto", sans-serif;
		font-size: 1rem;
		font-weight: bold;
		color: var(--main-color);
	}
</style>