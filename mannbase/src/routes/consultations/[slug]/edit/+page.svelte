<script lang="ts">
  import { goto } from "$app/navigation";
  import { authModel, save } from "$lib/pocketbase";
  import { alertOnFailure } from "$lib/pocketbase/ui";
  import type { PageData } from "./$types";
  export let data: PageData;
  $: ({ consultation } = data);
  async function submit(e: SubmitEvent) {
    consultation.user = $authModel?.id;
    alertOnFailure(async () => {
      await save("consultations", consultation);
      goto("../..");
    });
  }
</script>

<form on:submit|preventDefault={submit}>
  <input type="hidden" name="user" bind:value={consultation.user} placeholder="id" />
  <label for="quand">Quand (2024-MM-JJ HH:00)</label>
  <input name="quand" bind:value={consultation.quand}  placeholder="Quand (2024-MM-JJ HH:00)" />
  <textarea name="notes" bind:value={consultation.notes} placeholder="notes" rows="10" />
  <button type="submit">Submit</button>
</form>
