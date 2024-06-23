import pluginVue from 'eslint-plugin-vue'

  // extends: [
  //   "plugin:vue/vue3-recommended",
  //   "eslint:recommended",
  //   "@vue/prettier",
  // ],

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
    files: [
      "**/*.js",
      "**/*.vue",
    ]
  }
];
