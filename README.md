# Cypress Promise

This library promises to convert a Cypress chain into a real promise, which is required to use `async`/`await` in a Cypress test. This library is experimental and doesn't work inside a `before` or `beforeEach` block.

```ts
import promisify from 'cypress-promise'

it('should run tests with async/await', async () => {
  const foo = await promisify(cy.wrap('foo'))
  const bar = await promisify(cy.wrap('bar'))

  expect(foo).to.equal('foo')
  expect(bar).to.equal('bar')
})
```

An alternative it to use the 'register' polyfill to add `promisify` method to all Cypress chains. This requires `import 'cypress-promise/register'` in your `cypress/support/index` file:

```ts
it('should run tests with async/await', async () => {
  const foo = await cy.wrap('foo').promisify()
  const bar = await cy.wrap('bar').promisify()

  expect(foo).to.equal('foo')
  expect(bar).to.equal('bar')
}
```

Without this library and the `promisify` function/method, the expectation of `bar` would fail with `expected undefined to equal 'bar'`

## Why use this library?
The question about how to use async/await in Cypress test comes up from time to time in the gitter chat as well as in [GitHub Issue #1417](https://github.com/cypress-io/cypress/issues/1417). Sometimes you needs a value out of a chain and using `.then` just increases the nesting level, decreasing readability:

```ts
cy.get('.mySelector')
  .then($el => $el.text())
  .then(text => {
    // do some more commands using this text
    cy.get('.someOtherSelector')
      .then($el => $el.text())
      .should('equal', text)
```

[Aliases](https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html) don't help much in this case - we still have to nest. Ideally you'd want to write the following:

```ts
const text = await cy.get('.mySelector').then($el => $el.text())

// do some more commands using this text
cy.get('.someOtherSelector')
  .then($el => $el.text())
  .should('equal', text)
```

Since [Commands are not Promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Not-Promises), that code won't work. This library uses aliases and Cypress life-cycle events to force Cypress to play nicely with Promises:

```ts
import promisify from 'cypress-promise'

const text = await promisify(cy
  .get('.mySelector')
  .then($el => $el.text())
)

// do some more commands using this text
cy.get('.someOtherSelector')
  .then($el => $el.text())
  .should('equal', text)
```

## Best Practices
Cypress chains are powerful and declarative. [Custom Commands](https://medium.com/@NicholasBoll/cypress-io-scaling-e2e-testing-with-custom-commands-6b72b902aab) can be used to chain functions together that read like a series of steps without much extra syntax. Most Cypress commands work on elements and `await`ing them means all you can really do is `cy.wrap` them again. Only use `await` for non-element subjects that need to be used as inputs for other commands.

```ts
// very bad
const body = await promisify(cy.get('body'))
body.click() // This will use jQuery's click instead of Cypress's click, losing the power of Cypress

// bad
const el = await promisify(cy.get('.someSelector'))
// later
cy.wrap(el).click()

// good - use alias for elements. It makes sense and works with Type definitions
cy.get('.someSelector').as('someElement')
// later
cy.get('@someElement').click()

// good - use awaited promises for values to be used in chains
const text = await promisify(cy
  .get('.someSelector')
  .then(el => el.text())
)
cy.get('.someInput').type(text)
```

## Caveats
* `.promisify()` doesn't currently work inside `before` or `beforeEach` blocks. This is tracked by #1
* Cypress throws a warning about using Promises - on every use.
* `promisify()` is extra syntax - it can be easy to forget to call it.
* `.promisify()` will end the chain and return a Promise instead of a Chain, meaning you cannot chain further off of this method. When you think about it, this makes perfect sense, but could trip people up.
* You can't run Cypress commands inside a Promise's `.then` or `.catch`. Cypress will throw an error. I'm not sure it would make sense even if Cypress allowed it.

## Installation
```
npm install cypress-promise -D
```

If you get errors like "regeneratorRuntime is not defined.", you'll have to install `babel-polyfill` and add `import 'babel-polyfill'` to your `cypress/support/index`.

If you want to use the `cy.promisify()`, you'll have to add the following to your `cypress/support/index` file:

```ts
import 'cypress-promise/register'
```

