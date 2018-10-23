import React from 'react';
import classNames from 'classnames';
import Sidebarnav from './sidebarnav';
import Footer from '../footer';

import { ReactComponent as Chevron } from '../svgs/chevron.svg';

import './index.scss';

/* eslint-disable react/no-danger */

class Docpage extends React.Component {
	constructor(props) {
		super(props);
		this.sidebarRef = React.createRef();
		this.toggleRef = React.createRef();
		this.state = {
			isSidebarOpen: false,
		};
	}

	componentDidMount() {
		document.addEventListener('click', this.closeSidebarOnOuterClick);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.closeSidebarOnOuterClick);
	}

	closeSidebarOnOuterClick = e => {
		const { current: sidebarNode } = this.sidebarRef;
		const { current: toggleNode } = this.toggleRef;
		// Toggle it on anything that doesn't come from the sidebar itself
		const { target } = e;
		if (
			target !== sidebarNode &&
			!sidebarNode.contains(target) &&
			target !== toggleNode &&
			!toggleNode.contains(target)
		) {
			this.setState(state => {
				const { isSidebarOpen } = state;
				if (!isSidebarOpen) {
					return null;
				}
				return { isSidebarOpen: false };
			});
		}
	};

	toggleSidebar = () => {
		this.setState(state => ({ isSidebarOpen: !state.isSidebarOpen }));
	};

	render() {
		const {
			html,
			tableOfContents,
			title,
			currentSlug,
			children,
		} = this.props;
		const { isSidebarOpen } = this.state;
		return (
			<div
				className={classNames('wpackio-docpage', {
					'wpackio-docpage--sidebar-open': isSidebarOpen,
				})}
			>
				<div ref={this.toggleRef} className="wpackio-docpage__toggler">
					<button
						type="button"
						onClick={this.toggleSidebar}
						className="wpackio-docpage__button button is-dark"
					>
						<Chevron className="wpackio-docpage__button__left" />
						<Chevron className="wpackio-docpage__button__right" />
					</button>
				</div>
				<div className="wpackio-docpage__sidebar" ref={this.sidebarRef}>
					<Sidebarnav
						currentSlug={currentSlug}
						toc={tableOfContents}
					/>
				</div>
				<div className="wpackio-docpage__main">
					<section className="section">
						<div className="container">
							{html ? (
								<>
									<h1 className="title wpackio-docpage__title">
										{title}
									</h1>
									<div
										className="content wpackio-docpage__content"
										dangerouslySetInnerHTML={{
											__html: html,
										}}
									/>
								</>
							) : (
								children
							)}
						</div>
					</section>
					<Footer />
				</div>
			</div>
		);
	}
}

export default Docpage;
