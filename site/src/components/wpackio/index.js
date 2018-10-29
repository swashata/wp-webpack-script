import React from 'react';
import classNames from 'classnames';

// The styles are defined in layout.scss so that it can be used globally

const Wpackio = ({ isFlat = false }) => (
	<span
		className={classNames('wpackio-logo-text', {
			'wpackio-logo-text--flat': isFlat,
		})}
	>
		wpack.
		<em>io</em>
	</span>
);

export default Wpackio;
