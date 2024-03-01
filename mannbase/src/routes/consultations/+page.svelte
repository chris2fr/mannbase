<script lang="ts">
  import { metadata } from "$lib/app/stores";
  // import Image from "$lib/components/Image.svelte";
  // import { authModel, watch } from "$lib/pocketbase";
  import { authModel } from "$lib/pocketbase";
  // import type { ConsultationsResponse } from "$lib/pocketbase/generated-types";
  $metadata.title = "Recent Consultations";
  // const consultations = watch<ConsultationsResponse>("consultations", {
  //   sort: "-updated",
  // });
  // import { client } from "$lib/pocketbase";
    import { consultationsStore } from "$lib";
    import type { ConsultationsResponse } from "$lib/pocketbase/generated-types";
    import PocketBase, { type RecordModel } from 'pocketbase';
  // export let data: PageData;
  const pb = new PocketBase('http://127.0.0.1:8090');
  let consultations = <Promise<RecordModel[]>>pb.collection('consultations').getFullList({});
  consultationsStore.set(consultations)

</script>

{#if $authModel}
  <a href="new/edit">Create New</a>
{:else}
  <p>Please login to create new consultations.</p>
{/if}
<hr />
<table>
  <tbody>
    {#each $consultationsStore as consultation}
      {#if $authModel?.id == consultation.user}
        <tr>
          <td><a href={consultation.id}>{consultation.quand}</a></td>
          <td><a href={`${consultation.id}/edit`}>Edit</a></td>
          <td><a href={`${consultation.id}#delete`}>Delete</a></td>
        </tr>
      {:else}
        <tr>

          <td><a href={consultation.id}>{consultation.quand}</a></td>
          <td>{consultation.quand}</td>
        </tr>
      {/if}
    {:else}
      <tr>
        <td>No consultations found.</td>
      </tr>
    {/each}
  </tbody>
</table>
