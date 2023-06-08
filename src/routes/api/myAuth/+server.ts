import { json } from '@sveltejs/kit';

export async function POST(event) {
    const formData = await event.request.json();
    console.log(formData);
    return json({ message: "ok" });
}