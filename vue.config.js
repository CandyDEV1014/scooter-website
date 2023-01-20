module.exports = {
  transpileDependencies: ["vuetify", "vuex-persist"],
  css: {
    loaderOptions: {
      // sass: {
      //   additionalData: '@import "~@/styles/variables.scss";',
      // },
    },
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: "false",
    },
  },
  devServer: {
    compress: true,
    disableHostCheck: true,
  },
};
