export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devServer: {
    port: 3002,
    host: 'localhost' // or '0.0.0.0' to allow external access
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    prerender: {
      routes: ['/', '/404.html'], 
      ignore: ['/dynamic-routes', '/api'],
      failOnError: false
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_BASE_URL,
    },
  },
})
