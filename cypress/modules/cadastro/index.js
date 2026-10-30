function iniciarCadastro(name, email){
    cy.get('[data-qa="signup-name"]').type(name)
    cy.get('[data-qa="signup-email"]').type(email)
    cy.get('[data-qa="signup-button"]').click()
}

function preencherFormularioCadastro(){
    cy.get('#id_gender2').check()
        cy.get('[data-qa="password"]').type('123456')
        cy.get('[data-qa="days"]').select('14')
        cy.get('[data-qa="months"]').select('February')
        cy.get('[data-qa="years"]').select('2002')
        cy.get('#newsletter').click()
        cy.get('[data-qa="first_name"]').type('Louise')
        cy.get('[data-qa="last_name"]').type('Sabrina Andreia da Rosa')
        cy.get('[data-qa="company"]').type('Louise Sabrina Joalheria LTDA')
        cy.get('[data-qa="address"]').type('Recanto do Sol')
        cy.get('[data-qa="country"]').select('United States')
        cy.get('[data-qa="state"]').type('Anápolis')
        cy.get('[data-qa="city"]').type('Taboquinha')
        cy.get('[data-qa="zipcode"]').type('75074-110')
        cy.get('[data-qa="mobile_number"]').type('(62)99502-7381')
        cy.get('[data-qa="create-account"]').click()
}

function verificarCadastroSucesso(){
    cy.get('b')    
        .should('be.visible')
        .and('contain', 'Account Created!')
}

function verificarCadastroExistente(){
    cy.get('form[action*=signup] p')
        .should('exist')
        .should('contain', 'Email Address already exist!');
}

function validarMensagemTemporaria(seletor, mensagemEsperada) {

    return cy.window().then((win) => {

        return new Cypress.Promise((resolve, reject) => {

            const observer = new win.MutationObserver(() => {

                const elemento = win.document.querySelector(seletor);

                if (
                    elemento &&
                    elemento.textContent.includes(mensagemEsperada)
                ) {

                    observer.disconnect();
                    win.clearTimeout(timeout);

                    resolve(elemento.textContent.trim());
                }
            });

            const timeout = win.setTimeout(() => {

                observer.disconnect();

                reject(new Error(
                    `Mensagem não exibida: ${mensagemEsperada}`
                ));

            }, 10000);

            observer.observe(win.document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // Verifica se a mensagem já está presente
            const elemento = win.document.querySelector(seletor);

            if (
                elemento &&
                elemento.textContent.includes(mensagemEsperada)
            ) {

                observer.disconnect();
                win.clearTimeout(timeout);

                resolve(elemento.textContent.trim());
            }

        });

    }).then((textoEncontrado) => {

        expect(textoEncontrado).to.contain(mensagemEsperada);

    });
}

function deletarConta(){
    cy.contains('Delete Account').click()
    cy.contains('Account Deleted!').should('be.visible')
    cy.get('[data-qa="continue-button"]').click() 
}

module.exports = {
    iniciarCadastro,
    preencherFormularioCadastro,
    verificarCadastroSucesso,
    verificarCadastroExistente,
    validarMensagemTemporaria,
    deletarConta
}