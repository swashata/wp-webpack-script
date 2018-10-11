import React, { Component } from 'react';
import List from './List';

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
			items: [...state.items, state.term],
		}));
	};

	render() {
		const { term, items } = this.state;
		return (
			<div>
				<form className="App" onSubmit={this.onSubmit}>
					<input value={term} onChange={this.onChange} />
					<button type="submit">Add+</button>
				</form>
				<List items={items} />
			</div>
		);
	}
}
