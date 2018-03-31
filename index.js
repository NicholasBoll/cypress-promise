/// <reference types="cypress" />

function promisify(chain) {
  const id = Cypress._.uniqueId('promise_')

  // Alias the chain so we can access it later
  chain.as(id, { log: false })

  return new Cypress.Promise(function (resolve, reject) {
    // We must subscribe to failures and bail. Without this, the Cypress runner would never stop
    Cypress.on('fail', rejectPromise)

    // unsubscribe from test failure on both resolution and failure. This cleanup is essential
    function resolvePromise(value) {
      resolve(value)
      Cypress.off('fail', rejectPromise)
    }
    function rejectPromise(error) {
      reject(error)
      Cypress.off('fail', rejectPromise)
    }

    // aliases are the key to predictable interfacing between Chainers and Promises
    // The promise starts eagerly, but won't resolve until this $Chainer is ready
    cy.get(`@${id}`, { log: false }).then(resolvePromise)
  })
}

module.exports = promisify
module.exports.default = promisify // ES/TS module support
