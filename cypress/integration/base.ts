const getFromMocat = (...selectors: Parameters<typeof cy.get>) =>
  cy.get('#mocat-root').get(...selectors)
const getMocatBtn = () => getFromMocat('button').contains('Mocat')
const getFetchBtn = () => cy.get('button').contains('Fetch')
const getFetchTextarea = () => cy.get('[data-testid=fetch-textarea]')
const clickEmpty = () => cy.get('body').click(0, 0)
const clickMocat = () => getMocatBtn().click()

export const baseTest = (target: { name: string; url: string }) =>
  describe(`base on ${target.name}`, () => {
    before(() => {
      cy.visit(target.url)
    })

    beforeEach(() => {
      cy.reload()
    })

    it('should mocat loaded', () => {
      cy.get('#mocat-root').should('exist')
      getMocatBtn().should('be.visible')
    })

    it('should auto close work', () => {
      clickMocat()
      getMocatBtn().should('not.be.visible')
      getFromMocat('.MuiPaper-root').should('be.visible')
      clickEmpty()
      getMocatBtn().should('be.visible')
    })

    it('should LOCK work', () => {
      const getLockIcon = () => getFromMocat('[data-testid=LockIcon]')
      const getLockOpenIcon = () => getFromMocat('[data-testid=LockOpenIcon]')

      clickMocat()
      // pin
      getLockOpenIcon().click()
      getLockIcon().should('be.visible')
      clickEmpty()
      getMocatBtn().should('not.be.visible')
      getLockIcon().should('be.visible')

      // unpin
      getLockIcon().click()
      getLockOpenIcon().should('be.visible')
      clickEmpty()
      getLockOpenIcon().should('not.be.visible')
      getMocatBtn().should('be.visible')
    })

    it('should request trigger mocat', () => {
      getFetchBtn().click()
      getMocatBtn().should('not.be.visible')
      getFromMocat('.MuiCard-root').should('have.length', 1)
    })

    it('should SCENARIO works', () => {
      cy.intercept('/api', () => {
        throw new Error('should not request network')
      })

      getFetchBtn().click()
      getFromMocat('button').contains('Alice').click()
      getFetchTextarea().should('contain.value', 'Alice')
    })

    it('should PASS works', () => {
      cy.intercept('/api', (req) => {
        expect(req.url).to.include('/data.json')
        req.reply((res) => res)
      }).as('api')

      getFetchBtn().click()
      getFromMocat('[data-testid=SendIcon]').click()
      cy.wait('@api')
      getFetchTextarea().should('contain.value', 'real data')
    })

    it('should REJECT works', () => {
      cy.intercept('/api', () => {
        throw new Error('should not request network')
      })

      getFetchBtn().click()
      getFromMocat('[data-testid=DeleteIcon]').click()
      getFetchTextarea().should('contain.value', 'TypeError: Failed to fetch')
    })
  })
