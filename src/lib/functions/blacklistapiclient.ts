export default async function blacklistapiclient(blacklist: string, name: string, token: string) {
    const data = await fetch("/api/blacklist", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            blacklist: blacklist === "true" ? false : true,
            token,
        })
    });
    const dataText = await data.text();
    if (data.status !== 200) {
        return {
            message: JSON.parse(dataText).message,
            error: true,
        }
    }
    return {
        error: false,
        message: "Success"
    }
}