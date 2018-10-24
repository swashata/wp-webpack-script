/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
/* eslint-disable import/no-extraneous-dependencies */
const { createFilePath } = require('gatsby-source-filesystem');
const path = require('path');
const mm = require('micromatch');
const fs = require('fs');

/**
 * List all subdirectories of a directory
 */
const dirs = p =>
	fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());

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
		// Create additional fields if it is a part of docs
		if (mm.isMatch(node.fileAbsolutePath, '**/docs/*/*.md')) {
			const type = mm.capture(
				`${__dirname}/docs/*/*.md`,
				node.fileAbsolutePath
			);
			if (type && type[0]) {
				createNodeField({
					name: 'docType',
					node,
					value: type[0],
				});
			}
		}
	}
};

// Create pages for docs
exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions;
	const docTemplate = path.resolve('src/templates/docTemplate.js');
	const docRootTemplate = path.resolve('src/templates/docRootTemplate.js');

	// Individual doc pages
	const docs = new Promise((resolve, reject) => {
		graphql(`
			{
				allMarkdownRemark(
					filter: { fileAbsolutePath: { glob: "**/docs/**/*.md" } }
					sort: { order: DESC, fields: frontmatter___order }
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
		});
	});

	// Doc root pages
	const docRoots = new Promise((resolve, reject) => {
		// First get all directories inside docs
		const docTypes = dirs(path.resolve(__dirname, './docs'));
		if (docTypes && docTypes.length) {
			docTypes.forEach(docType => {
				createPage({
					path: `/${docType}/`,
					component: docRootTemplate,
					context: {
						docType,
					},
				});
			});
			resolve();
		} else {
			reject(new Error(`No directories found for document roots.`));
		}
	});

	return Promise.all([docs, docRoots]);
};
