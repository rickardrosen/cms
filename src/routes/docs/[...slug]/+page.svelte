<script lang="ts">
  import type { ActionData, PageData } from './$types'

  export let data: PageData
  export let form: ActionData

  let sha = data.sha
  let frontMatter = data.data
  const availableTags = ['ADR', 'Process'];
  let tags = frontMatter?.tags ?? []
  let showCommitModal = false
  let commitMessage = ''
  let commitAction: "save" | "delete"
  let action: string

  $: {
    editor?.value(data.content ?? '')
    sha = data.sha ?? ''
    frontMatter = data.data ?? {}
  }

  function submitAction(button) {
    showCommitModal = !showCommitModal
    console.log(showCommitModal)
    commitAction = button.target.name
  }

	import { onDestroy, onMount } from 'svelte';
  //import "easymde/src/css/easymde.css"
	//let showToolbar = true;
	let textArea: HTMLElement | undefined
	let editor: EasyMDE | null
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

<div class="editor">
  <form method="post" id="content">
    <div>
    <label for="title">Title:</label>
    <input size="60" name="title" type="text" bind:value={frontMatter.title} />
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
