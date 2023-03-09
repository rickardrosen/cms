import {
  GITHUB_APP_ID as appId,
  GITHUB_INSTALLATION as installationId,
  GITHUB_API_PRIVATE_KEY,
  GITHUB_ORG as owner,
  GITHUB_REPO as repo
} from '$env/static/private';
import { App } from 'octokit';
import type { Endpoints } from '@octokit/types';

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

export interface File {
  path: string;
  mode: '100644' | '100755' | '040000' | '160000' | '120000';
  type: 'commit' | 'tree' | 'blob';
  sha?: string | null;
  content: string;
}

export interface Commit {
  message: string,
  committer: {
    name: string,
    email: string
  }
  content: string
  sha?: string
}

type GetContentResponse = Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']
//type GetCommitsResponse = Endpoints['GET /repos/{owner}/{repo}/commits']['response'];
type PutContentResponse = Endpoints['PUT /repos/{owner}/{repo}/contents/{path}']['response']

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

export async function getContent(path: string): Promise<GetContentResponse['data']> {
  const res = await octokit.request('GET /repos/{owner}/{repo}/contents/docs/{path}', {
    owner,
    repo,
    path
  });
  return res.data
}

export async function updateFile(path: string, commit: Commit): Promise<PutContentResponse> {
   return await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path,
    ...commit
  })
}
