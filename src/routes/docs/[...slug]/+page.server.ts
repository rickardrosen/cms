import { error } from '@sveltejs/kit';
import { getContent, updateFile, type Commit } from '$lib/server/github';
import type { PageServerLoad, Actions } from './$types';
import matter from 'gray-matter';

export const load: PageServerLoad = async ({ params }) => {
  const gitContent = await getContent(params.slug);
  if (!gitContent) throw error(404);

  if ('content' in gitContent) {
    const { data, content } = matter(Buffer.from(gitContent.content, 'base64').toString());
    return { data, content, sha: gitContent.sha };
  }
};

export const actions: Actions = {
  save: async ({ request }) => {
    const { text, data, message, sha } = await request.formData().then((x) => {
      return {
        data: {
          title: x.get('title') as string,
          tags: x.getAll('tags') as string[]
        },
        text: x.get('content') as string,
        message: x.get('commitMessage') as string,
        sha: x.get('sha') as string
      };
    });
    const path = new URL(request.url).pathname.substring(1);
    const file = matter.stringify(text, data);
    const content = Buffer.from(file).toString('base64');
    const commit: Commit = {
      message,
      committer: {
        name: 'palle',
        email: 'palle@kalle.commit'
      },
      sha,
      content
    };
    const res = await updateFile(path, commit);
    if (res.status < 300) {
      return { success: true, sha: res.data.commit.sha };
    }
  }
};
