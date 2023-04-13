<script lang="ts">
  import Fab, { Icon } from '@smui/fab';
  import Card, {
    Content,
    PrimaryAction,
    Actions,
    ActionButtons,
    ActionIcons,
  } from '@smui/card';
  import Button, { Label } from '@smui/button';
	import { page } from "$app/stores";
  import Tree from '$lib/components/Tree.svelte'
  import type { LayoutData } from './$types'
  export let data: LayoutData
  const p = $page.url.pathname.split('/').slice(1)
  const { tree } = data
</script>

<style>
  .wrapper {
    display: flex;
    flex-flow: row wrap;
  }

  /* We tell all items to be 100% width, via flex-basis */
  .wrapper > * {
    flex: 1 100%;
  }

  /* We rely on source order for mobile-first approach
   * in this case:
   * 1. header
   * 2. article
   * 3. aside 1
   * 4. aside 2
   * 5. footer
   */

  /* Medium screens */
  @media all and (min-width: 600px) {
    /* We tell both sidebars to share a row */
    .aside { flex: 1 auto; }
  }

  /* Large screens */
  @media all and (min-width: 800px) {
    /* We invert order of first sidebar and main
     * And tell the main element to take twice as much width as the other two sidebars 
     */
    .main { flex: 3 0px; }
    .aside-1 { order: 1; }
    .main    { order: 2; }
    .aside-2 { order: 3; }
    .footer  { order: 4; }
  }
</style>

<div class="wrapper">
  <header class="header">Header</header>
  <main class="main">
    <!-- +page.svelte is rendered in this <slot> -->
    <slot />
  </main>

  <aside class="aside nav">
    <div class="flexy">
      <div class="margins">
        <Tree {tree} {p} />
      </div>
      <div class="margins">
        <form action="{$page.url.pathname.replace(/\/[^/]+\/?$/, '')}">
          <Fab name="add" value="page">
            <Icon class="material-icons">add</Icon>
          </Fab>
        </form>
      </div>
    </div>
  </aside>
  <aside class="aside aside-2">
  <div class="card-display">
    <div class="card-container">
    <Card>
      <Content>{$page.data.currentNode}</Content>
    </Card>
    </div>
  </div>
  </aside>
  <footer class="footer">Footer</footer>
</div>
