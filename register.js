/// <reference types="cypress" />

const promisify = require('./')

// We have to use a `before` otherwise Cypress will complain about `cy.wrap` being used outside a test
before(function () {
  // use cy.wrap().__proto__ because weo don't have access to the $Chainer.prototype directly
  cy.wrap('').__proto__.promisify = function () {
    return promisify(this)
  }
})

