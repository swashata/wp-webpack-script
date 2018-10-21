import React from 'react';

import './index.scss';

const Feature = props => {
	const { icon, title, children } = props;
	return (
		<aside className="wpackio-feature">
			<div className="wpackio-feature__icon">{icon}</div>
			<h2 className="wpackio-feature__title title">{title}</h2>
			<div className="wpackio-feature__desc">{children}</div>
		</aside>
	);
};

export default Feature;
