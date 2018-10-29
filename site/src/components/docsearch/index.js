import React from 'react';
import docsearch from 'docsearch.js';
import classNames from 'classnames';

import { ReactComponent as SearchIcon } from '../svgs/magnifier.svg';
import './index.scss';

class DocSearch extends React.Component {
	state = {
		focused: false,
	};

	componentDidMount() {
		// Initialize Algolia search.
		docsearch({
			apiKey: '2ed553faf01ab789d57bd2882ddd2b2d',
			indexName: 'wpack_io',
			inputSelector: '#algolia-doc-search',
		});
	}

	handleFocus = () => this.setState({ focused: true });

	handleBlur = () => this.setState({ focused: false });

	render() {
		const { focused } = this.state;

		return (
			<form
				className={classNames('wpackio-docsearch', {
					'wpackio-docsearch--focused': focused,
				})}
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
