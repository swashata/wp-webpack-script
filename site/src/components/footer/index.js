import React from 'react';

import './index.scss';

const Footer = props => (
	<footer className="footer wpackio-site-footer">
		<div className="container">
			<div className="columns">
				<div className="column is-one-third">
					<h4 className="subtitle">
						ABOUT{' '}
						<span className="wpackio-logo-text">
							wpack.
							<em>io</em>
						</span>
					</h4>
					<ul>
						<li>
							&copy; {new Date().getFullYear()} -{' '}
							<a href="https://swas.io">Swashata Ghosh.</a>{' '}
							<a href="http://opensource.org/licenses/mit-license.php">
								MIT
							</a>
							.
						</li>
						<li>
							website content{' '}
							<a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
								CC BY NC SA 4.0
							</a>
						</li>
					</ul>
					<p>
						Feel free to poke around and become awesome WordPress
						Front-end developer.
					</p>
				</div>
				<div className="column is-one-third">
					<h4 className="subtitle">INSPIRING PROJECTS</h4>
					<ul>
						<li>
							<a href="https://github.com/ahmadawais/create-guten-block">
								create-guten-block
							</a>{' '}
							by{' '}
							<a href="https://github.com/ahmadawais">
								@ahmadawais
							</a>
							.
						</li>
						<li>
							<a href="https://github.com/jaredpalmer/presspack">
								presspack
							</a>{' '}
							by{' '}
							<a href="https://github.com/jaredpalmer">
								@jaredpalmer
							</a>
							.
						</li>
						<li>
							<a href="https://github.com/crossfield/gutenblock">
								gutenblock
							</a>{' '}
							by <a href="https://github.com/zackify">@zackify</a>
						</li>
					</ul>
				</div>
				<div className="column is-one-third">
					<h4 className="subtitle">CREDITS</h4>
					<ul>
						<li>
							Icons used from{' '}
							<a href="https://www.flaticon.com">flaticon</a>.
						</li>
						<li>
							Font <a href="https://dank.sh">Dank Mono</a>.
						</li>
						<li>
							Powered by{' '}
							<a href="https://www.gatsbyjs.org/">
								Gatsby - Build blazing fast apps and websites
								with React!
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</footer>
);

export default Footer;
