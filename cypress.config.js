const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: 1,
  reporter: 'cypress-mochawesome-reporter',
  env: {
    theme: "dark" // Define o tema escuro
  },
  e2e: {  
    baseUrl: 'https://www.automationexercise.com/',  
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
