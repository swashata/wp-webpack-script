import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout'

export default function Template({
	data, // this prop will be injected by the GraphQL query below.
}) {
	const { markdownRemark } = data; // data.markdownRemark holds our post data
	const { frontmatter, html } = markdownRemark;
	return (
		<Layout>
			<div className="blog-post-container">
				<div className="blog-post">
					<h1>{frontmatter.title}</h1>
					<h2>{frontmatter.category}</h2>
					<div
						className="blog-post-content"
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</div>
			</div>
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
