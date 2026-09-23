import { ROUTES } from '../../src/config/routes';

describe('Feedback page', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/posts', { statusCode: 201, body: { id: 101 } });
  });

  it('shows validation errors for empty submit', () => {
    cy.visit(ROUTES.FEEDBACK);
    cy.get('[data-testid="feedback-submit"]').click();
    cy.get('.field-error').first().should('be.visible');
  });

  it('submits valid feedback', () => {
    cy.visit(ROUTES.FEEDBACK);
    cy.get('[placeholder="Ada Lovelace"]').clear().type('Ada Lovelace');
    cy.get('[placeholder="ada@example.com"]').clear().type('ada@example.com');
    cy.get('[placeholder="What should we improve?"]')
      .clear()
      .type('Please add more examples for routing.');
    cy.get('[data-testid="feedback-submit"]').click();
    cy.get('[data-testid="feedback-success"]', { timeout: 15_000 }).should(
      'contain.text',
      'submitted successfully',
    );
  });
});
