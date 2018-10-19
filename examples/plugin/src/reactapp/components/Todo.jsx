import React, { Component } from 'react';
import uuid from 'uuid/v4';
import List from './List';
import './App.scss';

export default class Todo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			term: '',
			items: [],
		};
	}

	onChange = event => {
		this.setState({ term: event.target.value });
	};

	onSubmit = event => {
		event.preventDefault();
		this.setState(state => ({
			term: '',
			items: [
				...state.items,
				{ text: state.term, done: false, id: uuid() },
			],
		}));
	};

	toggleDone = id => {
		this.setState(state => {
			const items = state.items.map(item => {
				// Find the one with Id and toggle it's done
				if (item.id === id) {
					return {
						...item,
						done: !item.done,
					};
				}
				return item;
			});
			return { items };
		});
	};

	render() {
		const { term, items } = this.state;
		return (
			<div>
				<form className="App" onSubmit={this.onSubmit}>
					<input value={term} onChange={this.onChange} />
					<button type="submit">+ Add Todo</button>
				</form>
				<List items={items} toggleDone={this.toggleDone} />
			</div>
		);
	}
}
