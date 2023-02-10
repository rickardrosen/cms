import { getTreeByName } from '$lib/server/github';

interface TreeNode {
	name: string;
	type?: string;
	path?: string;
	children: TreeNode[];
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const gitTree = await getTreeByName('docs');
	const tree: TreeNode = {
		name: 'Root',
		children: []
	};
	tree.children = gitTree.reduce((r: TreeNode[], n) => {
		n.path.split('/').reduce((childNodes: TreeNode[], name) => {
			let child = childNodes.find((n) => n.name === name);
			if (!child) {
				childNodes.push((child = { name, path: n.path, children: [] }));
			}
			return child.children;
		}, r);
		return r;
	}, []);
	console.log(tree);
	return tree;
}
