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
	const { frontmatter, html, tableOfContents } = markdownRemark;
	return (
		<Layout decorate={false} path={location.pathname}>
			<Helmet
				title={`${frontmatter.title} - ${site.siteMetadata.title}`}
				meta={[
					{
						property: 'og:type',
						content: 'article',
					},
					{
						name: 'description',
						content: markdownRemark.excerpt,
					},
				]}
			/>
			<Docpage
				html={html}
				title={frontmatter.title}
				tableOfContents={tableOfContents}
				currentSlug={location.pathname}
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
		}
		site {
			siteMetadata {
				title
			}
		}
	}
`;
