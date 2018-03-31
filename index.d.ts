/**
 * Take a Cypress chain and turn it into a Promise
 * 
 * ```ts
 * const text = await promisify(cy
 *   .get('someselector')
 *   .then(el => el.text())
 * )
 * console.log(text) // logs text of someselector element
 * ```
 * @param chain Cypress $Chainer instance
 */
function promisify<T>(chain: Cypress.Chainable<T>): Promise<T>

exports = promisify
export default promisify
