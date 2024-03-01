<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { metadata } from "$lib/app/stores";
  import Delete from "$lib/components/Delete.svelte";
  import { client } from "$lib/pocketbase";
  import type { PageData } from "./$types";
  export let data: PageData;
  $: ({
    consultation: { id, quand, notes },
  } = data);
  $: $metadata.title = quand;
</script>

{#if $page.url.hash === "#delete"}
  <Delete table="consultations" {id} />
{/if}

{notes}

<a href={`${base}/auditlog/consultations/${id}`}>
  <button type="button">AuditLog</button>
</a>

<style>
  img {
    max-width: 100%;
  }
</style>
