/** @type {import('next').NextConfig} */
const nextConfig = {
	// 将 experimental.turbo.enabled 改为 turbopack
	// 从:
	// experimental: {
	//   turbo: {
	//     enabled: true
	//   }
	// }

	// 改为:
	turbopack: true,

	// 保留其他配置...
};

module.exports = nextConfig;
