import {
  GITHUB_APP_ID as appId,
  GITHUB_INSTALLATION as installationId,
  GITHUB_API_PRIVATE_KEY
} from '$env/static/private';
import { App } from 'octokit';

const owner = 'academicwork';
const repo = 'handbook';
const privateKey = Buffer.from(GITHUB_API_PRIVATE_KEY, 'base64').toString('ascii');
const app = new App({ appId, privateKey });
//const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
const octokit = await app.getInstallationOctokit(parseInt(installationId));

export interface GitTreeNode {
  path: string;
  mode: number;
  type: string;
  size: number;
  sha: string;
  url: string;
}

interface GitTree {
  sha: string;
  url: string;
  tree: GitTreeNode[];
}

async function getBranchTreeSha(branch: string) {
  const res = await octokit.request(`GET /repos/{owner}/{repo}/branches/{branch}`, {
    owner,
    repo,
    branch
  });
  return res.data['commit']['commit']['tree']['sha'];
}

async function getTree(tree_sha: string): Promise<GitTreeNode[]> {
  const res = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}{?recursive}', {
    owner,
    repo,
    tree_sha,
    recursive: 'true'
  });
  return res.data.tree;
}

export async function getTreeByName(tree = 'docs'): Promise<GitTreeNode[]> {
  const masterTreeSha = await getBranchTreeSha('master');
  const masterTree = await getTree(masterTreeSha);
  const treeNode = masterTree.find((x) => x.path === tree);
  if (!treeNode) {
    throw new Error(tree + ' not found');
  }
  return await getTree(treeNode.sha);
}
