module.exports = {
  publicPath: "/minecraft-item-browser/",
  pages: {
    index: {
      entry: "src/main.js",
      title: "Minecraft Item Browser"
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set("vue", "@vue/compat");

    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        };
      });
  }
};
