// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'de'], // Add your supported languages
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development', // Optional: reload in dev
};
