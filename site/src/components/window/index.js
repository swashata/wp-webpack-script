import React from 'react';
import classNames from 'classnames';

import './index.scss';

const Window = props => {
	const {
		title = null,
		type = 'terminal',
		children,
		className = '',
		minHeight = '27rem',
	} = props;
	return (
		<section
			className={classNames(
				'wpackio-window',
				`wpackio-window--${type}`,
				className
			)}
			style={{
				minHeight,
			}}
		>
			<div className="wpackio-window__titlebar">{title}</div>
			{children}
		</section>
	);
};

export default Window;
