import { json } from "@sveltejs/kit";

export async function POST() {
    console.log("post request");
    return json({msg: "good"});
}