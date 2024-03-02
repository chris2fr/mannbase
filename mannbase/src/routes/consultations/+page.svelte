<script lang="ts">
  import { metadata } from "$lib/app/stores";
  import { client } from "$lib/pocketbase";
  $metadata.title = "Recent Consultations";
  export const getConsultations = async () => {
    return await client.collection('consultations').getFullList({});
  };
</script>

{#if client.authStore.isAuthRecord}
  <a href="new/edit">Create New</a>
{:else}
  <p>Please login to create new consultations.</p>
{/if}
<hr />
<table>
  <tbody>
    {#await getConsultations() then consultations}
    {#each consultations as consultation}
      {#if client.authStore.model?.id == consultation.user}
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
    {/await}
  </tbody>
</table>
