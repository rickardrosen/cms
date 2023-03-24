import { getTreeByName } from '$lib/server/github';

interface TreeNode {
	name: string
	type: string
	path: string
	children: TreeNode[]
  hidden: boolean
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const gitTree = await getTreeByName('docs');
	const tree: TreeNode = {
		name: 'docs',
		children: [],
    type: 'root',
    path: '',
    hidden: false
	};
	tree.children = gitTree.reduce((r: TreeNode[], n) => {
		n.path.split('/').reduce((childNodes: TreeNode[], name) => {
			let child = childNodes.find((n) => n.name === name)
			if (!child) {
				childNodes.push((child = { name, path: n.path, children: [], type: n.type === "tree" ? "folder" : "file", hidden: false }));
			}
			return child.children
		}, r)
		return r
	}, [])

  const sectionIndex = (t: TreeNode) => {
      for(let child of t.children){
        if(child.name.startsWith('index.md')){
          t.path = child.path
          child.hidden = true
        }
        sectionIndex(child)
    }
    return t
  }

  return sectionIndex(tree)
}
