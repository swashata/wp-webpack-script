import React from 'react';
import './List.scss';
/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
const List = ({ items, toggleDone }) => (
	<ul className="List">
		{items.map((item, index) => (
			<li
				key={item.id}
				title={
					item.done ? 'Click to mark undone' : 'Click to mark done'
				}
				onClick={e => {
					e.preventDefault();
					toggleDone(item.id);
				}}
			>
				<span
					className={`symbol symbol--${
						item.done ? 'green' : 'yellow'
					}`}
				>
					{item.done ? '✔︎' : '❯'}
				</span>{' '}
				{item.text}
			</li>
		))}
	</ul>
);

export default List;
