/// <reference types="cypress" />

function promisify(chain) {
  return new Cypress.Promise((resolve, reject) => {
    // We must subscribe to failures and bail. Without this, the Cypress runner would never stop
    Cypress.on('fail', rejectPromise)

    // // unsubscribe from test failure on both success and failure. This cleanup is essential
    function resolvePromise(value) {
      resolve(value)
      Cypress.off('fail', rejectPromise)
    }
    function rejectPromise(error) {
      reject(error)
      Cypress.off('fail', rejectPromise)
    }

    chain.then(resolvePromise)
  })
}

module.exports = promisify
module.exports.default = promisify // ES/TS module support
