import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import classNames from 'classnames';

import './index.scss';

const getDocByCategory = (docType, allDocs) =>
	allDocs.filter(doc => doc.node.fields.docType === docType);

const Sidebarnav = props => (
	<StaticQuery
		query={graphql`
			query allDocs {
				allMarkdownRemark(
					filter: { fileAbsolutePath: { glob: "**/docs/**/*.md" } }
					sort: { order: ASC, fields: frontmatter___order }
				) {
					edges {
						node {
							id
							fields {
								slug
								docType
							}
							frontmatter {
								order
								title
								shortTitle
							}
						}
					}
				}
				site {
					siteMetadata {
						docTypeOrder {
							docType
							label
						}
					}
				}
			}
		`}
		render={data => {
			const { currentSlug, toc } = props;
			const {
				site: {
					siteMetadata: { docTypeOrder },
				},
				allMarkdownRemark: { edges },
			} = data;
			// Get all categorized docs
			return (
				<aside className="wpackio-docsidebarnav menu">
					{docTypeOrder.map(({ docType, label }) => {
						const docs = getDocByCategory(docType, edges);
						return (
							<React.Fragment key={docType}>
								<p className="menu-label">
									<Link
										className={classNames({
											'is-active':
												currentSlug === `/${docType}/`,
										})}
										to={`/${docType}/`}
									>
										{label}
									</Link>
								</p>
								<ul className="menu-list">
									{docs.map(({ node: doc }) => (
										<li key={doc.id}>
											<Link
												to={doc.fields.slug}
												className={classNames({
													'is-active':
														currentSlug ===
														doc.fields.slug,
												})}
												title={doc.frontmatter.title}
											>
												{doc.frontmatter.shortTitle}
											</Link>
											{currentSlug === doc.fields.slug &&
											toc ? (
												<div
													dangerouslySetInnerHTML={{
														__html: toc,
													}}
													className="wpackio-docsidebarnav__toc"
												/>
											) : null}
										</li>
									))}
								</ul>
							</React.Fragment>
						);
					})}
				</aside>
			);
		}}
	/>
);

export default Sidebarnav;
