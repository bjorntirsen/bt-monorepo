/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Get element by data-cy attribute
       * @param {string} selector - data-cy selector
       * @example cy.getByCy('submit-button')
       */
      getByCy(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("getByCy", (selector: string) => {
  return cy.get(`[data-cy=${selector}]`);
});
