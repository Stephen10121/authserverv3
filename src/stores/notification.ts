import { writable } from "svelte/store";

export type Notification = null | { type: "error" | "success", message: string }

export const notification = writable<Notification>(null);