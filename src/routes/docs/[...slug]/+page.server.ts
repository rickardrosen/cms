import { error } from '@sveltejs/kit';
import { getContent, updateFile, type Commit } from '$lib/server/github';
import type { PageServerLoad, Actions } from './$types';
import matter from 'gray-matter';

export const load: PageServerLoad = async ({ params }) => {
  const gitContent = await getContent(params.slug);
  if (!gitContent) throw error(404);

  if ('content' in gitContent) {
    const { data, content } = matter(Buffer.from(gitContent.content, 'base64').toString());
    console.log(data);
    return { data, content, sha: gitContent.sha };
  }
};

export const actions: Actions = {
  save: async ({ request }) => {
    const { content, sha } = await request.formData().then((x) => {
      return {
        content: x.get('content') as string,
        sha: x.get('sha') as string
      };
    });
    const path = new URL(request.url).pathname.substring(1);
    const commit: Commit = {
      message: 'mess',
      committer: {
        name: 'palle',
        email: 'palle@kalle.commit'
      },
      sha,
      content: Buffer.from(content).toString('base64')
    };
    console.log('updating git with', commit);
    const res = await updateFile(path, commit);
    if (res.status < 300) {
      return { success: true, sha: res.data.commit.sha };
    }
  }
};
