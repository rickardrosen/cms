<script lang="ts">
  import type { ActionData, PageData } from './$types'
  import { page } from '$app/stores';
	import EasyMde from '$lib/components/EasyMde.svelte';

  export let data: PageData
  export let form: ActionData

  const availableTags = ['ADR', 'Process'];

  let sha: string
  let frontMatter
  let tags
  let showCommitModal = false
  let commitMessage = ''
  let commitAction: "save" | "delete" | "create"
  let currentNode: TreeNode
  let addPage: boolean
  let content: string

  $: {
    content = data.content ?? ''
    addPage = $page.url.searchParams.get('add') === 'page'
    tags = frontMatter?.tags ?? []
    sha = data.sha ?? ''
    frontMatter = data.frontmatter ?? {}
    currentNode = decodeURI($page.url.pathname).split("/").slice(2).reduce((p: TreeNode, c) => {
      if(p.children !== undefined && p.children.length > 0){
        return p.children.find(x => x.name === c)
      }
    }, $page.data.tree)
  }

  function submitAction(action) {
    showCommitModal = !showCommitModal
    commitAction = action
  }
</script>
<div class="flex p-1">
  <div hidden={currentNode.section && !addPage}>
    <form method="post" id="content">
      <div hidden={!addPage}>
        <label for="name">Filename:</label>
        <input size="60" name="filename" disabled={!addPage} type="text" title="File should end with '.md' or '.mdx'" pattern=".md,$" />
        <input type="checkbox" name="addPage" checked={addPage} style="display:none"/>
      </div>
        <div class="mb-6">
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
      <input type="text" id="title" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" label="Title" name="title" value={frontMatter.title ?? ''} />
  </div>
      <div class="max-h-screen">
        <EasyMde {content} />
      </div>
      <input name="sha" type="hidden" bind:value={data.sha} />
    </form>
    <button disabled={showCommitModal} on:click="{() => { commitAction = 'save'; showCommitModal = !showCommitModal}}">
      Save
    </button>
    <button disabled={showCommitModal} on:click="{() => { commitAction = 'delete'; showCommitModal = !showCommitModal}}">
      Delete
    </button>
    {#if showCommitModal}
    <input type="text" name="commitMessage" form="content" placeholder="Enter commit message..." size="50" bind:value={commitMessage}/>
    <button type="submit" form="content" formaction="?/{commitAction}" disabled={commitMessage.length === 0}>
      Commit
    </button>
    <button type="button" on:click="{() => showCommitModal = !showCommitModal}">
      Cancel
    </button>
    {/if}
    {#if form?.success}
      <p>File commited successfully! 🥳</p>
    {/if}
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}
  </div>
  <aside class="self-start sticky top-20 flex-initial max-w-sm rounded shadow-lg ml-3 p-2">
    <h3 class="mb-4 font-semibold">Tags</h3>
    <ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    {#each availableTags as tag}
    <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
        <div class="flex items-center pl-3">
            <input type="checkbox" name="{tag}" value="{tag}" checked="{tags.includes(tag)}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
            <label for="{tag}" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{tag}</label>
        </div>
    </li>
    {/each}
    </ul>
  </aside>
</div>
