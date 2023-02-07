<script lang="ts">
  import Tree from './Tree.svelte'
  /** @type {import('./$types').LayoutData} */
  export let data
</script>

<main>
  <!-- +page.svelte is rendered in this <slot> -->
  <slot />
</main>

<aside>
  <h2>Files</h2>
<Tree {data} />
</aside>
