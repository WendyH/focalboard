// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

describe('Card badges', () => {
    beforeEach(() => {
        cy.apiInitServer()
        cy.apiResetBoards()
        cy.apiGetMe().then((userID) => cy.apiSkipTour(userID))
        localStorage.setItem('welcomePageViewed', 'true')
        localStorage.setItem('language', 'en')
    })

    it('Shows and hides card badges', () => {
        cy.visit('/')

        // Create new board
        cy.uiCreateNewBoard('Testing')

        // Add a new card
        cy.uiAddNewCard('Card')

        // Add some comments
        cy.log('**Add some comments**')
        addComment('Some comment')
        addComment('Another comment')
        addComment('Additional comment')

        // Add card description
        cy.log('**Add card description**')
        cy.findByText('Добавить описание...').click()
        cy.findByRole('combobox').type('## Header\n- [ ] one\n- [x] two{esc}')

        // Add checkboxes
        cy.log('**Add checkboxes**')
        cy.findByRole('button', {name: 'Add content'}).click()
        cy.findByRole('button', {name: 'checkbox'}).click()
        cy.focused().type('three{enter}')
        cy.focused().type('four{enter}')
        cy.focused().type('{esc}')
        cy.findByDisplayValue('three').prev().click()

        // Close card dialog
        cy.log('**Close card dialog**')
        cy.findByRole('button', {name: 'Close dialog'}).click()
        cy.findByRole('dialog').should('not.exist')

        // Show card badges
        cy.log('**Show card badges**')
        cy.findByRole('button', {name: 'Properties menu'}).click()
        cy.findByRole('button', {name: 'Comments and description'}).click()
        cy.findByTitle('This card has a description').should('exist')
        cy.findByTitle('Comments').contains('3').should('exist')
        cy.findByTitle('Checkboxes').contains('2/4').should('exist')

        // Hide card badges
        cy.log('**Hide card badges**')
        cy.findByRole('button', {name: 'Comments and description'}).click()
        cy.findByRole('button', {name: 'Properties menu'}).click()
        cy.findByTitle('This card has a description').should('not.exist')
        cy.findByTitle('Comments').should('not.exist')
        cy.findByTitle('Checkboxes').should('not.exist')
    })

    const addComment = (text: string) => {
        cy.findByText('Add a comment...').click()
        cy.findByRole('combobox').type(text).blur()
        cy.findByRole('button', {name: 'Send'}).click()
    }
})
