<script lang="ts">
  import type { ActionData, PageData } from './$types'
  import { page } from '$app/stores';

  export let data: PageData
  export let form: ActionData

  const availableTags = ['ADR', 'Process'];

  let sha: string
  let frontMatter
  let tags
  let showCommitModal = false
  let commitMessage = ''
  let commitAction: "save" | "delete"
  let currentNode: TreeNode
  let crumbs = []
	let editor: EasyMDE | null
  let addPage

  $: {

    addPage = $page.url.searchParams.get('add') === 'page'
    tags = frontMatter?.tags ?? []
    editor?.value(data.content ?? '')
    sha = data.sha ?? ''
    frontMatter = data.data ?? {}
    currentNode = decodeURI($page.url.pathname).split("/").slice(2).reduce((p: TreeNode, c) => {
      if(p.children !== undefined && p.children.length > 0){
        return p.children.find(x => x.name === c)
      }
    }, $page.data.tree)
    crumbs = $page.url.pathname.split('/').slice(1).reduce((p, c, i) => {
      let curr
      if(i === 0){
        curr = {
          href: '',
          name: ''
        }
      }else{
        const { href, name } = p[i-1]
        curr = {
          href: `${href}/${c}`,
          name: c
        }
      }
      p.push(curr)
      return p
    }, []).slice(1)
  }

  function submitAction(button) {
    showCommitModal = !showCommitModal
    commitAction = button.target.name
  }
	import { onDestroy, onMount } from 'svelte';
  //import "easymde/src/css/easymde.css"
	//let showToolbar = true;
	let textArea: HTMLElement | undefined
	// Setting up the editor and the visible buttons of the toolbar
	onMount(async () => {
		const easymde = await import('easymde')
		const EasyMDE = easymde.default;
		editor = new EasyMDE({
			element: textArea,
			autofocus: true,
			spellChecker: false,
			nativeSpellcheck: true,
			theme: 'easymde',
			autosave: {
				enabled: true,
				uniqueId: 'easymde-autosave',
				delay: 1000
			},
			toolbar: [
				'preview',
				'|',
				'bold',
				'italic',
				'strikethrough',
				'|',
				'heading-bigger',
				'heading-smaller',
				'heading-1',
				'heading-2',
				'heading-3',
				'|',
				'unordered-list',
				'ordered-list',
				'|',
				'code',
				'image',
				'link',
				'quote',
				'table',
				'horizontal-rule',
				'|',
				'redo',
				'undo',
				'guide',
				'|',
			],
			status: ['autosave', 'words'],
			hideIcons: ['fullscreen', 'side-by-side'],
		});
  editor.value(data.content ?? '')
	});
	// Resetting the editor when clearing it
	onDestroy(() => {
		if (editor) {
			editor.toTextArea()
			editor = null
		}
	});
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css">
	<title>Editor</title>
</svelte:head>
<div>
<ul>
  {#each crumbs as crumb}
  <li>{crumb.href}</li>
  {/each}
</ul>
</div>
<div class="editor" hidden={currentNode.section && !addPage}>
  <form method="post" id="content">
    <div hidden={!addPage}>
    <label for="name">Filename:</label>
    <input size="60" name="filename" disabled={!addPage} type="text" />
    </div>
    <div>
    <label for="title">Title:</label>
    <input size="60" name="title" type="text" value={frontMatter.title ?? ''} />
    </div>
    <span>Tags:</span>
    {#each availableTags as tag}
    <input type="checkbox" bind:group={tags} id="{tag}" name="{tag}" value="{tag}" checked="{tags.includes(tag)}">
    <label for="{tag}">{tag}</label>
    {/each}
    <input name="tags" type="hidden" bind:value={tags} />
    <textarea name="content" bind:this={textArea} />
    <input name="sha" type="hidden" bind:value={data.sha} />
  </form>
  <button name="save" disabled={showCommitModal} on:click="{submitAction}">
    Save
  </button>
  <button name="delete" disabled={showCommitModal} on:click="{submitAction}">
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
</div>
