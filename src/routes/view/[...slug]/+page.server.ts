import { error } from '@sveltejs/kit';
import { getContent } from '$lib/server/github';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

export const load = (async ({ params }) => {
	const data = await getContent(params.slug);
	if (!data) throw error(404);
	if ('content' in data) {
		const html = marked.parse(Buffer.from(data.content, 'base64').toString());
		return { md: Buffer.from(data.content, 'base64').toString() };
	}
	return {
		data
	};
}) satisfies PageServerLoad;
