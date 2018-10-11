import React from 'react';

const List = ({ items }) => (
	<ul>
		{items.map((item, index) => (
			<li key={index}>{item}</li>
		))}
	</ul>
);

export default List;
