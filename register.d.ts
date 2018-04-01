declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * End the Cypress chain and return a promise instead. Useful for await
     * ```ts
     * const text = await cy.get('selector').then(el => el.text()).promisify()
     * console.log(text) // logs text content
     * ```
     */
    promisify(): Promise<Subject>
  }
}
