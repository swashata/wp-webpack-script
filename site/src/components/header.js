import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import classNames from 'classnames';
import './header.scss';

import { ReactComponent as LogoSymbol } from './svgs/wpackio-symbol.svg';
import { ReactComponent as LogoText } from './svgs/wpackio-text.svg';

class Header extends React.Component {
	state = {
		isOpen: false,
	};

	handleToggle = e => {
		e.preventDefault();
		this.setState(state => ({ isOpen: !state.isOpen }));
	};

	render() {
		const { siteTitle } = this.props;

		return (
			<StaticQuery
				query={graphql`
					query {
						logoText: file(
							relativePath: { eq: "wpackio-text.svg" }
						) {
							publicURL
						}
						logoSymbol: file(
							relativePath: { eq: "wpackio-symbol.svg" }
						) {
							publicURL
						}
					}
				`}
				render={data => (
					<nav
						role="navigation"
						aria-label="main navigation"
						className="navbar site-header is-fixed-top"
					>
						<div className="container">
							<div className="navbar-brand">
								<Link to="/" className="navbar-item">
									<h1 className="site-header__logo">
										<LogoSymbol
											height="1.75em"
											width="1.75em"
										/>
										<span className="wpackio-logo-text">
											wpack.
											<em>io</em>
										</span>
									</h1>
								</Link>
								<a
									role="button"
									className={classNames(
										'burger',
										'navbar-burger',
										{
											'is-active': this.state.isOpen,
										}
									)}
									aria-label="menu"
									aria-expanded="false"
									data-target="navbarBasicExample"
									href="#"
									onClick={this.handleToggle}
								>
									<span aria-hidden="true" />
									<span aria-hidden="true" />
									<span aria-hidden="true" />
								</a>
							</div>
							<div
								className={classNames(
									'site-header__nav',
									'navbar-menu',
									{
										'is-active': this.state.isOpen,
									}
								)}
							>
								<div className="navbar-end site-header__main-nav">
									<Link className="navbar-item" to="/">
										Getting Started
									</Link>
									<Link className="navbar-item" to="/">
										Config
									</Link>
									<Link className="navbar-item" to="/">
										Concepts
									</Link>
								</div>
							</div>
						</div>
					</nav>
				)}
			/>
		);
	}
}

export default Header;
