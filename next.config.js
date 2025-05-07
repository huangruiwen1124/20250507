/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve.alias.canvas = false;
		config.module.rules.push({
			test: /pdf\.worker\.(min\.)?js/,
			type: 'asset/resource',
			generator: {
				filename: 'static/worker/[hash][ext][query]',
			},
		});
		return config;
	},
	experimental: {
		turbo: {
			enabled: false,
		},
	},
};

module.exports = nextConfig;
