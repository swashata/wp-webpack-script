import React from 'react';
import Window from '../window';
import './index.scss';

const Hero = props => {
	const {
		title,
		children,
		subtitle,
		cta,
		cta2,
		terminalTitle,
		minHeight,
	} = props;
	return (
		<div className="wpackio-hero hero">
			<div className="hero-body">
				<div className="container">
					<h2 className="wpackio-hero__title title">{title}</h2>
					<Window
						className="wpackio-hero__terminal"
						title={terminalTitle}
						type="terminal"
						minHeight={minHeight}
					>
						{children}
					</Window>
					<h3 className="wpackio-hero__subtitle subtitle">
						{subtitle}
					</h3>
					<div className="wpackio-hero__ctas">
						{React.cloneElement(cta, {
							className:
								'wpackio-hero__cta button is-large is-white',
						})}
						{React.cloneElement(cta2, {
							className:
								'wpackio-hero__cta button is-large is-white',
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
