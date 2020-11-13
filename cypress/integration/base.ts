export const baseTest = (target: { name: string; url: string }) =>
  describe(`base on ${target.name}`, () => {
    before(() => {
      cy.visit(target.url)
    })

    it('should mocat loaded', () => {
      cy.get('#mocat-root').should('exist')
      cy.contains('Mocat').should('be.visible')
    })

    it('should auto close work', () => {
      cy.contains('Mocat').click()
      cy.contains('Mocat').should('not.be.visible')
      cy.get('body').click(0, 0)
      cy.contains('Mocat').should('be.visible')
    })

    it('should request trigger mocat', () => {
      cy.contains('Fetch').click()
      cy.contains('Run/network/before')
      cy.get('body').click(0, 0)
      cy.contains('Mocat').should('be.visible')
    })

    it('should pass works', () => {
      cy.route2('/api', (req) => {
        expect(req.url).to.include('/data.json')
        req.reply((res) => res)
      }).as('api')

      cy.contains('Mocat').click()
      cy.contains('Pass').click()
      cy.wait('@api')
      cy.get('textarea')
        .invoke('val')
        .then((text) => {
          cy.log(text?.toString() ?? '')
          expect(text?.toString()).includes('real data')
        })

      cy.get('body').click(0, 0)
      cy.contains('Mocat').should('be.visible')
    })

    it('should scene works', () => {
      cy.route2('/api', () => {
        throw new Error('should not request network')
      })

      cy.contains('Fetch').click()
      cy.get('#mocat-root').contains('Alice').should('be.visible')
      cy.contains('Alice').click()
      cy.get('textarea')
        .invoke('val')
        .then((text) => {
          cy.log(text?.toString() ?? '')
          expect(text?.toString()).includes('Alice')
        })
    })
  })
