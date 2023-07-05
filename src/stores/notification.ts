import { writable } from "svelte/store";

export type Notification = { type: "error" | "success", message: string }
export type Info = { data: string, id: any }

export const notification = writable<Notification[]>([]);
export const info = writable<Info[]>([]);