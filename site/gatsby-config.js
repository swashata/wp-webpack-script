module.exports = {
	siteMetadata: {
		title: 'WPACK.IO',
		docTypeOrder: [
			{
				docType: 'guides',
				label: 'Quick Start',
			},
			{
				docType: 'configuration',
				label: 'Config API',
			},
			{
				docType: 'commands',
				label: 'Commands',
			},
			{
				docType: 'tutorials',
				label: 'Tutorials',
			},
			{
				docType: 'concepts',
				label: 'Concepts',
			},
		],
		social: {
			twitter: 'https://twitter.com/swashata',
			github: 'https://github.com/swashata/wp-webpack-script',
		},
	},
	plugins: [
		'gatsby-plugin-sass',
		'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: 'WPACK.IO - WordPress Bundling',
				short_name: 'WPACK.IO',
				start_url: '/',
				background_color: '#ffffff',
				theme_color: '#ffffff',
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
		'gatsby-plugin-catch-links',
		{
			resolve: 'gatsby-transformer-remark',
			options: {
				gfm: true,
				commonmark: true,
				footnotes: true,
				pedantic: true,
				// blocks: ["h2"], Blocks option value can be provided here as an array.
				excerpt_separator: `<!-- end -->`,
				plugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 740,
						},
					},
					`gatsby-remark-copy-linked-files`,
					{
						resolve: `gatsby-remark-smartypants`,
						options: {
							dashes: `oldschool`,
						},
					},
					{
						resolve: `gatsby-remark-autolink-headers`,
						options: {
							offsetY: 58,
						},
					},
					{
						resolve: `gatsby-remark-prismjs`,
						options: {
							noInlineHighlight: true,
						},
					},
				],
			},
		},
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
		'gatsby-plugin-netlify-cache',
		// make sure to put last in the array
		{
			resolve: `gatsby-plugin-netlify`,
		},
	],
};
