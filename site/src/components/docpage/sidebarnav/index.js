import React from 'react';
import { Link } from 'gatsby';

import './index.scss';

const getDocByCategory = (cat, allDocs) =>
	allDocs.filter(doc => doc.node.frontmatter.category === cat);

const Sidebarnav = props => {
	const { allDocs, currentSlug, toc } = props;
	const categories = ['Guides', 'Configuration', 'Tutorials'];
	// Get all categorized docs
	return (
		<div className="wpackio-docsidebarnav">
			{categories.map(cat => {
				const docs = getDocByCategory(cat, allDocs);
				return (
					<div className="wpackio-docsidebarnav__list" key={cat}>
						{docs.map(({ node: doc }) => (
							<div
								className="wpackio-docsidebarnav__doc"
								key={doc.id}
							>
								<Link to={doc.fields.slug}>
									{doc.frontmatter.title}
								</Link>
								{currentSlug === doc.fields.slug ? (
									<div
										className="wpackio-docsidebarnav__toc"
										dangerouslySetInnerHTML={{
											__html: toc,
										}}
									/>
								) : null}
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
};

export default Sidebarnav;
