const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const config = { output: 'export', images: { unoptimized: true }, basePath, trailingSlash: true };
export default config;
