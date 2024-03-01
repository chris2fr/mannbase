import { client } from "$lib/pocketbase";
import type { PageLoad } from "./$types";

export const load: PageLoad = async function ({ url, params: { slug } }) {
  const { items } = await client
    .collection("consultations")
    .getList(undefined, undefined, {
      filter: `slug="${slug}"`,
    });
  const [consultation] = items;

  return {
    consultation,
  };
};
