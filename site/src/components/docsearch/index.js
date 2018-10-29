import React from 'react';
import classNames from 'classnames';

import { ReactComponent as SearchIcon } from '../svgs/magnifier.svg';
import './index.scss';

class DocSearch extends React.Component {
	state = {
		focused: false,
	};

	hasSearchInited = false;

	initSearch = () => {
		if (this.hasSearchInited) {
			return;
		}
		// Initialize Algolia search.
		this.hasSearchInited = true;
		import('docsearch.js').then(({ default: docsearch }) => {
			docsearch({
				apiKey: '2ed553faf01ab789d57bd2882ddd2b2d',
				indexName: 'wpack_io',
				inputSelector: '#algolia-doc-search',
			});
		});
	};

	handleFocus = () => {
		this.initSearch();
		this.setState({ focused: true });
	};

	handleBlur = () => this.setState({ focused: false });

	render() {
		const { focused } = this.state;

		return (
			<form
				className={classNames('wpackio-docsearch', {
					'wpackio-docsearch--focused': focused,
				})}
				onMouseEnter={this.initSearch}
				onTouchStart={this.initSearch}
			>
				<div className="control has-icons-left">
					<input
						className="input wpackio-docsearch__input"
						id="algolia-doc-search"
						type="search"
						placeholder="Search"
						aria-label="Search docs"
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
					/>
					<span className="icon is-left wpackio-docsearch__icon">
						<SearchIcon className="wpackio-docsearch__svg" />
					</span>
				</div>
			</form>
		);
	}
}

export default DocSearch;
