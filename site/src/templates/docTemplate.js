import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import Docpage from '../components/docpage';

export default function DocTemplate({
	data, // this prop will be injected by the GraphQL query below.
	location, // available from gatsby
}) {
	const { markdownRemark, site } = data; // data.markdownRemark holds our post data
	const {
		frontmatter,
		html,
		tableOfContents,
		timeToRead,
		excerpt,
		parent: { relativePath },
	} = markdownRemark;
	const { title } = frontmatter;
	return (
		<Layout decorate={false} path={location.pathname}>
			<Helmet
				title={`${title} - ${site.siteMetadata.title}`}
				meta={[
					{
						property: 'og:type',
						content: 'article',
					},
					{
						name: 'description',
						content: excerpt,
					},
					{
						property: 'og:title',
						content: title,
					},
					{
						property: 'og:description',
						content: excerpt,
					},
					{
						name: 'twitter:description',
						content: excerpt,
					},
					{
						name: 'twitter.label1',
						content: 'Reading time',
					},
					{
						name: 'twitter:data1',
						content: `${timeToRead} min read`,
					},
				]}
			/>
			<Docpage
				html={html}
				title={title}
				tableOfContents={tableOfContents}
				currentSlug={location.pathname}
				gitPath={relativePath}
			/>
		</Layout>
	);
}

export const pageQuery = graphql`
	query($path: String!) {
		markdownRemark(fields: { slug: { eq: $path } }) {
			html
			frontmatter {
				title
			}
			tableOfContents(pathToSlugField: "fields.slug")
			excerpt(pruneLength: 158)
			parent {
				... on File {
					relativePath
				}
			}
			timeToRead
		}
		site {
			siteMetadata {
				title
			}
		}
	}
`;
