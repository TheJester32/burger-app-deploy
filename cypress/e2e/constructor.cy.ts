import "@4tw/cypress-drag-drop";

describe("constructor", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.viewport(1920, 1080);
    cy.intercept("GET", "api/ingredients", { fixture: "ingredients.json" }).as(
      "getIngredients"
    );
    cy.wait("@getIngredients");

    cy.get('ul[data-cy="ingredients"]')
      .children()
      .should("exist")
      .as("ingredients");

    cy.get("@ingredients").eq(1).as("bun");
    cy.get("@ingredients").eq(3).as("main");
    cy.get("@ingredients").last().as("sauce");
  });

  it("should handle modal interactions correctly", () => {
    cy.get('li[data-cy="constructor-ingredient"]').eq(0).click();
    cy.get('div[data-cy="modal-overlay"]').click({ force: true });
    cy.get('div[data-cy="modal-overlay"]').should('not.exist');

    cy.get('li[data-cy="constructor-ingredient"]').eq(1).click();
    cy.get('body').type('{esc}');
    cy.get('div[data-cy="modal-overlay"]').should('not.exist');

    cy.get('li[data-cy="constructor-ingredient"]').eq(2).click();
    cy.get('div[data-cy="modal-close-btn"]').click({ force: true });
    cy.get('div[data-cy="modal-overlay"]').should('not.exist');
  });

  it("should add ingredients to the constructor and login with creating a new order", () => {
    cy.get('ul[data-cy="bun-upper-drag-area"]').as("dropContainerUpperBun");
    cy.get('ul[data-cy="main-middle"]').as("dropMiddleContainer");
    cy.get('ul[data-cy="bun-lower-drag-area"]').as("dropContainerLowerBun");

    cy.get("@bun").drag("@dropContainerUpperBun");
    cy.get("@main").drag("@dropMiddleContainer");
    cy.get("@sauce").drag("@dropMiddleContainer");

    cy.get("@dropContainerUpperBun").should("not.be.empty");
    cy.get("@dropMiddleContainer").should("not.be.empty");
    cy.get("@dropContainerLowerBun").should("not.be.empty");

    cy.get("button[data-cy='place-order']").click();

    cy.get("input[name=email]").type("test@yandex.ru");
    cy.get("input[name=password]").type("Qwe1234");
    cy.get("button[type='submit']").click();

    cy.intercept("POST", "api/auth/login", { fixture: "user.json" }).as("login");
    cy.wait("@login");

    cy.intercept("POST", "api/orders", { fixture: "order.json" }).as("order");

    cy.get("button[data-cy='place-order']").click();
    cy.wait("@order");

    cy.get('h3[data-cy="order-number"]').contains("666");

    cy.get('div[data-cy="modal-overlay"]').click({ force: true });
    cy.get('div[data-cy="modal-overlay"]').should('not.exist');
  });

});
