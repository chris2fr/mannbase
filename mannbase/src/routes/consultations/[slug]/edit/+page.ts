import { client } from "$lib/pocketbase";
import type { ConsultationsRecord } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async function ({ params: { slug: id } }) {
  const consultation: ConsultationsRecord =
    id === "new"
      ? ({} as ConsultationsRecord)
      : await client.collection("consultations").getOne(id);

  return {
    consultation,
  };
};
