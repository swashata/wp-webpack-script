import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import Docpage from '../components/docpage';

const DocRootTemplate = props => {
	const { data, pageResources } = props;
	return (
		<Layout decorate={false}>
			<Docpage currentSlug={pageResources.page.path}>
				{data.docTypes.edges.map(docType => {
					const {
						node: {
							excerpt,
							fields: { slug },
							frontmatter: { title },
							id,
						},
					} = docType;
					return (
						<div className="box" key={id}>
							<article className="media">
								<h2 className="title">
									<Link to={slug}>{title}</Link>
								</h2>
								<div className="content">
									<p>{excerpt}</p>
								</div>
								<Link
									className="button is-regular is-link"
									to={slug}
								>
									Read More
								</Link>
							</article>
						</div>
					);
				})}
			</Docpage>
		</Layout>
	);
};

export default DocRootTemplate;

export const pageQuery = graphql`
	query($docType: String!) {
		docTypes: allMarkdownRemark(
			filter: { fields: { docType: { eq: $docType } } }
			sort: { order: ASC, fields: frontmatter___order }
		) {
			edges {
				node {
					id
					fields {
						slug
					}
					excerpt(pruneLength: 300, truncate: true)
					frontmatter {
						title
					}
				}
			}
		}
	}
`;
