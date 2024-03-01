import { client } from "$lib/pocketbase";

const consultations = await client
    .collection("consultations")
    .getList(undefined, undefined, {});

export default consultations;