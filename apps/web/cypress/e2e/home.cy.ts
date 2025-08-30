describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the home page with Turborepo logo", () => {
    cy.get("img[alt='Turborepo logo']").should("be.visible");
    cy.get("main").should("exist");
  });

  it("should display the getting started instructions", () => {
    cy.get("ol").should("exist");
    cy.get("ol li").first().should("contain", "Get started by editing");
    cy.get("code").should("contain", "apps/web/app/page.tsx");
  });

  it("should have working call-to-action buttons", () => {
    cy.get("a[href*='vercel.com/new/clone']").should("contain", "Deploy now");
    cy.get("a[href*='turborepo.com/docs']").should("contain", "Read our docs");
    cy.get("button").should("contain", "Open alert");
  });

  it("should have footer links", () => {
    cy.get("footer").should("exist");
    cy.get("footer a[href*='turborepo.com']").should(
      "contain",
      "Go to turborepo.com"
    );
    cy.get("footer a[href*='vercel.com/templates']").should(
      "contain",
      "Examples"
    );
  });

  it("should be responsive", () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.get("body").should("be.visible");

    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.get("body").should("be.visible");

    // Test desktop viewport
    cy.viewport(1280, 720);
    cy.get("body").should("be.visible");
  });
});
