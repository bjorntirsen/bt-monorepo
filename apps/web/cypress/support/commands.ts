/// <reference types="cypress" />

// Add custom commands here
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command types here if needed
    }
  }
}

// Example custom command
// Cypress.Commands.add('login', (email, password) => { ... })
