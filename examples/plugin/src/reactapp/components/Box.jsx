import React from 'react';

const Box = ({ heading, children }) => (
	<div className="box">
		<h2>{heading}</h2>
		<div className="box__content">{children}</div>
	</div>
);

export default Box;
