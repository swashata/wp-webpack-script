module.exports = {
	siteMetadata: {
		title: 'WPACK.IO',
	},
	plugins: [
		'gatsby-plugin-sass',
		'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: 'gatsby-starter-default',
				short_name: 'starter',
				start_url: '/',
				background_color: '#663399',
				theme_color: '#663399',
				display: 'minimal-ui',
				icon: 'src/images/favicon.png', // This path is relative to the root of the site.
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: `${__dirname}/src/images/`,
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'fp-mission',
				path: `${__dirname}/frontpage/missions/`,
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'fp-steps',
				path: `${__dirname}/frontpage/steps/`,
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'docs',
				path: `${__dirname}/docs/`,
			},
		},
		'gatsby-transformer-remark',
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		'gatsby-plugin-offline',
		{
			resolve: 'gatsby-plugin-svgr',
			options: {
				icon: true,
				viewBox: true,
				// see https://github.com/smooth-code/svgr for a list of all options
			},
		},
	],
};
