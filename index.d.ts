/**
 * Convert a Cypress $Chainer instance to a Promise
 * 
 * ```ts
 * const text = await promisify(cy
 *   .get('someselector')
 *   .then(el => el.text())
 * )
 * console.log(text) // logs text of someselector element
 * ```
 * @param chain Cypress $Chainer instance
 * @returns Promise of the last subject in the Cypress chain
 */
function promisify<T>(chain: Cypress.Chainable<T>): Promise<T>

exports = promisify
export default promisify
