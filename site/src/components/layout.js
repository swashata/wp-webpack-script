import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import Header from './header';
import Footer from './footer';
import './bulma.scss';
import './layout.scss';
import './dank-mono.css';

const Layout = ({ children, decorate = true, path = undefined }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
				site {
					siteMetadata {
						title
						docTypeOrder {
							docType
							label
						}
						social {
							twitter
							github
						}
					}
				}
				image: file(name: { eq: "feature" }) {
					childImageSharp {
						resize(width: 1500) {
							src
						}
					}
				}
			}
		`}
		render={data => (
			<>
				<Helmet
					title={`${
						data.site.siteMetadata.title
					} - javascript & css tooling for WordPress themes & plugins`}
					meta={[
						{
							name: 'description',
							content:
								'wpackio is a fine-tuned webpack/browser-sync configuration made specifically for WordPress Theme and Plugin Development.',
						},
						{
							name: 'keywords',
							content: 'wordpress, webpack, build, javascript',
						},
						{
							property: 'og:image',
							content: data.image.childImageSharp.resize.src,
						},
						{
							property: 'twitter:image',
							content: data.image.childImageSharp.resize.src,
						},
						{
							property: 'og:type',
							content: 'website',
						},
					]}
				>
					<html lang="en" />
				</Helmet>
				<Header
					siteTitle={data.site.siteMetadata.title}
					docTypes={data.site.siteMetadata.docTypeOrder}
					twitter={data.site.siteMetadata.social.twitter}
					github={data.site.siteMetadata.social.github}
					path={path}
				/>
				{decorate ? (
					<>
						<div className="site-main">{children}</div>
						<Footer />
					</>
				) : (
					children
				)}
			</>
		)}
	/>
);

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;
