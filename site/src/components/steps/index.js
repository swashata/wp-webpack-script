import React from 'react';
import classNames from 'classnames';

import './index.scss';

const Steps = props => {
	const { image, html, title, order } = props;
	const isEven = order % 2 === 0;
	return (
		<section
			className={classNames('section', 'wpackio-steps', {
				'wpackio-steps--even': isEven,
			})}
		>
			<div className="container">
				<div className="columns">
					<div className="column is-half wpackio-steps__image">
						<a href={image}>
							<img alt={title} src={image} />
						</a>
					</div>
					<div className="column is-half wpackio-steps__desc">
						<div className="wpackio-steps__content">
							<h3 className="subtitle wpackio-steps__subtitle">{title}</h3>
							<div
								className="content wpackio-steps__html"
								dangerouslySetInnerHTML={{ __html: html }}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Steps;
