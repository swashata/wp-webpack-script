import React from 'react';

import { ReactComponent as WPEForm } from '../../images/wpeform.svg';
import './index.scss';

export default function WPEFormPromo({
	utmCampaign = 'hero_banner',
	background = 'light',
}) {
	return (
		<div className={`wpeform-promo wpeform-promo--${background}`}>
			<p className="wpeform-promo__ad-header">Promotion</p>
			<div className="wpeform-promo__body">
				<a
					href={`https://www.wpeform.io?utm_source=wpack.io&utm_medium=link&utm_campaign=${utmCampaign}`}
					className="wpeform-promo__image"
					rel="friend"
					aria-label="Check out WPEForm a WordPress Form Builder"
				>
					<WPEForm />
				</a>
				<div className="wpeform-promo__content">
					<h3 className="wpeform-promo__title">
						<a
							href={`https://www.wpeform.io?utm_source=wpack.io&utm_medium=link&utm_campaign=${utmCampaign}`}
							className="wpeform-promo__link"
							rel="friend"
						>
							WPEForm - No-code Drag-n-Drop WordPress Form Builder
						</a>
					</h3>
					<div className="wpeform-promo__article">
						<p>
							Useful for payments, quotation, quizzes, conversations &amp; user
							feedbacks of all kinds.
						</p>
						<p>
							<a
								href={`https://www.wpeform.io?utm_source=wpack.io&utm_medium=link&utm_campaign=${utmCampaign}`}
								className="wpeform-promo__link"
								rel="friend"
							>
								Check out to support my efforts (made by me)
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
