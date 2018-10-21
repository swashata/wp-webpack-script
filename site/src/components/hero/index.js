import React from 'react';
import Window from '../window';
import './index.scss';

const Hero = props => {
	const { title, children, subtitle, cta, terminalTitle } = props;
	return (
		<div className="wpackio-hero hero">
			<div className="hero-body">
				<div className="container">
					<h1 className="wpackio-hero__title title">{title}</h1>
					<Window
						className="wpackio-hero__terminal"
						title={terminalTitle}
						type="terminal"
					>
						{children}
					</Window>
					<h2 className="wpackio-hero__subtitle subtitle">
						{subtitle}
					</h2>
					{React.cloneElement(cta, {
						className: 'wpackio-hero__cta button is-large is-white',
					})}
				</div>
			</div>
		</div>
	);
};

export default Hero;
