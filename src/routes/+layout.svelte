<script>
  /** @type {import('./$types').LayoutData} */
  export let data;
</script>

<main>
  <!-- +page.svelte is rendered in this <slot> -->
  <slot />
</main>

<aside>
  <h2>Files</h2>
  <ul>
    {#each data.files as file}
      <li>
        <a href="/file/{file}">
          {file}
        </a>
      </li>
    {/each}
  </ul>
</aside>
