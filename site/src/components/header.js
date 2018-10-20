import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import { css } from 'emotion';
import styled from 'react-emotion';
import { gradientDark, navbarLight } from '../utils/background';

import './header.scss';

const Header = ({ siteTitle }) => (
	<StaticQuery
		query={graphql`
			query {
				logoText: file(relativePath: { eq: "wpackio-text.svg" }) {
					publicURL
				}
				logoSymbol: file(relativePath: { eq: "wpackio-symbol.svg" }) {
					publicURL
				}
			}
		`}
		render={data => (
			<header className="site-header">
				<h1 className="site-header__logo">
					<Link to="/">
						<img
							className={css`
								height: 1em;
								width: auto;
								margin: 0 0.5rem 0 0;
							`}
							src={data.logoSymbol.publicURL}
							alt={siteTitle}
						/>
						<img
							className={css`
								height: 1em;
								width: auto;
								margin: 0 0.5rem 0 0;
							`}
							src={data.logoText.publicURL}
							alt={siteTitle}
						/>
					</Link>
				</h1>
				<nav className="site-header__nav">
					<ul>
						<li>
							<Link to="/">Getting Started</Link>
						</li>
						<li>
							<Link to="/">Config</Link>
						</li>
						<li>
							<Link to="/">Concepts</Link>
						</li>
					</ul>
				</nav>
			</header>
		)}
	/>
);

export default Header;
