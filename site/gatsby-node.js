/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { createFilePath } = require('gatsby-source-filesystem');
const path = require('path');

// Create slugs
exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions;

	if (node.internal.type === `MarkdownRemark`) {
		const value = createFilePath({ node, getNode });
		createNodeField({
			name: `slug`,
			node,
			value,
		});
	}
};

// Create pages for docs
exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions;
	const docTemplate = path.resolve('src/templates/docTemplate.js');

	// Main doc page
	const docs = new Promise((resolve, reject) => {
		resolve(
			graphql(`
				{
					allMarkdownRemark(
						filter: {
							fileAbsolutePath: { glob: "**/docs/**/*.md" }
						}
						sort: { order: DESC, fields: frontmatter___category }
					) {
						edges {
							node {
								fields {
									slug
								}
							}
						}
					}
				}
			`).then(result => {
				if (result.errors) {
					reject(result.errors);
				}

				result.data.allMarkdownRemark.edges.forEach(({ node }) => {
					createPage({
						path: node.fields.slug,
						component: docTemplate,
					});
				});
				resolve();
			})
		);
	});

	return Promise.all([docs]);
};
