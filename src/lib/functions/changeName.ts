export default async function changeName(token: string, newName: string) {
    try {
        const resp = await fetch("/api/changeName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newName
            })
        });
        const respJSON = await resp.json();
        console.log(respJSON);
        if (respJSON.msg) {
            return { success: respJSON.msg }
        }
        if (respJSON.error) {
            return { error: respJSON.error }
        }
        return { error: "Failed to change name." }
    } catch (err) {
        console.error(err);
        return { error: "Failed to change name." }
    }
}