/// <reference types="cypress" />

const promisify = require('./')

// We have to use a `before` otherwise Cypress will complain about `cy.wrap` being used outside a test
before(function () {
  // use cy.wrap().__proto__ because we don't have access to the $Chainer.prototype directly
  // cy commands return $Chainer and the __proto__ value is $Chainer.prototype
  cy.wrap('').__proto__.promisify = function () {
    return promisify(this)
  }
})

