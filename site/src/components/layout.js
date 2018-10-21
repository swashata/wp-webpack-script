import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import Header from './header';
import './bulma.scss';
import './layout.scss';
import './dank-mono.css';

const Layout = ({ children }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
				site {
					siteMetadata {
						title
					}
				}
			}
		`}
		render={data => (
			<>
				<Helmet
					title={data.site.siteMetadata.title}
					meta={[
						{ name: 'description', content: 'Sample' },
						{ name: 'keywords', content: 'sample, something' },
					]}
				>
					<html lang="en" />
				</Helmet>
				<Header siteTitle={data.site.siteMetadata.title} />
				<div className="site-main">{children}</div>
				<footer className="footer site-footer">
					<div className="content has-text-centered">
						&copy; <em>wpack.io</em> by{' '}
						<a href="https://swas.io">Swashata Ghosh</a>. The source
						code is licensed{' '}
						<a href="http://opensource.org/licenses/mit-license.php">
							MIT
						</a>
						. The website content is licensed{' '}
						<a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
							CC BY NC SA 4.0
						</a>
						. Icons used from{' '}
						<a href="https://www.flaticon.com" rel="nofollow">
							flaticon
						</a>
						. Font <a href="https://dank.sh">Dank Mono</a>. Powered
						by{' '}
						<a href="https://www.gatsbyjs.org/">
							Gatsby - Build blazing fast apps and websites with
							React!
						</a>
					</div>
				</footer>
			</>
		)}
	/>
);

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;
