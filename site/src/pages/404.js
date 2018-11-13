import React from 'react';
import Layout from '../components/layout';

const NotFoundPage = () => (
	<Layout>
		<section className="section">
			<div className="container">
				<h1 className="title">NOT FOUND</h1>
				<p>
					You just hit a route that doesn&#39;t exist... the sadness.
				</p>
				<p>
					Try going to the front page or check out the navigation bar.
				</p>
			</div>
		</section>
	</Layout>
);

export default NotFoundPage;
