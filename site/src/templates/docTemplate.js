import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Docpage from '../components/docpage';

export default function DocTemplate({
	data, // this prop will be injected by the GraphQL query below.
	pageResources, // available from gatsby
}) {
	const { markdownRemark } = data; // data.markdownRemark holds our post data
	const { frontmatter, html, tableOfContents } = markdownRemark;
	return (
		<Layout decorate={false}>
			<Docpage
				html={html}
				frontmatter={frontmatter}
				tableOfContents={tableOfContents}
				currentSlug={pageResources.page.path}
				allDocs={data.allMarkdownRemark.edges}
			/>
		</Layout>
	);
}

export const pageQuery = graphql`
	query($path: String!) {
		allMarkdownRemark(
			filter: { fileAbsolutePath: { glob: "**/docs/**/*.md" } }
			sort: { order: DESC, fields: frontmatter___category }
		) {
			edges {
				node {
					id
					fields {
						slug
					}
					frontmatter {
						category
						title
					}
				}
			}
		}
		markdownRemark(fields: { slug: { eq: $path } }) {
			html
			frontmatter {
				category
				title
			}
			tableOfContents(pathToSlugField: "fields.slug")
		}
	}
`;
