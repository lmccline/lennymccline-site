import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({ html: true, typographer: true });

export async function GET(context) {
	const site = context.site;
	const essays = (await getCollection('essays')).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf()
	);

	return rss({
		title: 'Lenny McCline',
		description: 'I am a builder whose creative mediums span data platforms, biology, AI, biosecurity, business, and startups.',
		site,
		items: essays.map((essay) => ({
			title: essay.data.title,
			pubDate: essay.data.date,
			description: essay.data.description,
			link: `/${essay.id}/`,
			// Feed readers need absolute URLs; the essays use site-root paths.
			content: sanitizeHtml(parser.render(essay.body), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ['src', 'alt', 'width', 'height'],
				},
			}).replaceAll('"/', `"${site}`),
		})),
		customData: '<language>en-us</language>',
	});
}
