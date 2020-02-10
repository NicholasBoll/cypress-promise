import promisify from '../../'

describe('promisify()', () => {
  it('should await the value of a single promise', async () => {
    const foo = await promisify(cy.wrap('foo'))

    expect(foo).to.equal('foo')
  })

  it('should allow catching of failed commands', async () => {
    await promisify(cy.get('shouldFail', { timeout: 50 }))
      .catch(error => {
        // Can't do any Cypress stuff here
        expect(error.message).to.contain('Timed out')
      })
  })

  it('should await the value of multiple promises', async () => {
    const foo = await promisify(cy.wrap('foo'))
    const bar = await promisify(cy.wrap('bar'))

    expect(foo).to.equal('foo')
    expect(bar).to.equal('bar')
  })

  it('should fail and bubble the error to mocha to stop the runner', async () => {
    const body = await promisify(cy.get('body'))
    expect(body).to.be.visible

    await promisify(cy.get('notfound', { timeout: 1000 })).catch(err => {
      expect(err.message).to.contain(`Expected to find element: 'notfound', but never found it`)
      return true
    })
  })
})

describe('cy.promisify()', () => {
  it('should await the value of a single promise', async () => {
    const foo = await cy.wrap('foo').promisify()

    expect(foo).to.equal('foo')
  })

  it('should allow catching of failed commands', async () => {
    await cy.get('shouldFail', { timeout: 50 })
      .promisify()
      .catch(error => {
        // Can't do any Cypress stuff here
        expect(error.message).to.contain('Timed out')
      })
  })

  it('should await the value of multiple promises', async () => {
    const foo = await cy.wrap('foo').promisify()
    const bar = await cy.wrap('bar').promisify()

    expect(foo).to.equal('foo')
    expect(bar).to.equal('bar')
  })

  it('should handle multiple disconnected .then calls and resolve everything correctly', async () => {
    const fooPromise = cy.wrap('foo').promisify()
    const bar = await cy.wrap('bar').promisify()

    fooPromise.then(foo => {
      expect(foo).to.equal('foo')
    })

    fooPromise.then(foo => {
      expect(foo).to.equal('foo')
    })

    const foo = await fooPromise
    expect(foo).to.equal('foo')
    expect(bar).to.equal('bar')
  })

  it('should fail and bubble the error to mocha to stop the runner', async () => {
    const body = await cy.get('body').promisify()
    expect(body).to.be.visible

    await cy.get('notfound', { timeout: 1000 })
      .promisify().catch(err => {
        expect(err.message).to.contain(`Expected to find element: 'notfound', but never found it`)
        return true
      })
  })
})
