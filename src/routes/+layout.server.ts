import { getTreeByName } from '$lib/server/github';
import type { LayoutServerLoad } from './$types';

interface TreeNode {
	name: string;
	type: string;
	path: string;
	children: TreeNode[];
	hidden: boolean;
	section: boolean;
}

/** @type {import('./$types').LayoutServerLoad} */
export const load: LayoutServerLoad = async () => {
	const gitTree = await getTreeByName('docs');
	const tree: TreeNode = {
		name: 'docs',
		children: [],
		type: 'root',
		path: '',
		hidden: false,
    section: true
	};

	tree.children = gitTree.reduce((r: TreeNode[], n) => {
		n.path.split('/').reduce((childNodes: TreeNode[], name) => {
			let child = childNodes.find((n) => n.name === name);
			if (!child) {
				childNodes.push(
					(child = {
						name,
						path: n.path,
						children: [],
						type: n.type === 'tree' ? 'folder' : 'file',
						hidden: false,
            section: n.type === 'tree' ? true : false
					})
				);
			}
			return child.children;
		}, r);
		return r;
	}, []);

	const sectionIndex = (t: TreeNode) => {
		for (let child of t.children) {
			if (child.name.startsWith('index.md')) {
        //child.type = "folder"
				child.hidden = true
        t.path = child.path
        t.section = true
			}
			sectionIndex(child);
		}
		return t;
	};

  const navTree = sectionIndex(tree)
	return {tree: navTree};
}
