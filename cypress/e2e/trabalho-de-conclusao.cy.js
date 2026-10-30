/// <reference types="cypress"/>

const cadastro = require('../modules/cadastro/index');
const login = require('../modules/login/index');

describe('Automation Exercise',()=>{

    const nome = 'PGATS Aut'
    const email = `pgats-aut-${Date.now()}@email.com`
    const senha = '123456'

    it('Caso de Teste 01: Registrar Usuário', () => {
        cy.visit('https://www.automationexercise.com/')
        cy.get('a[href*=login]').click();

        cadastro.iniciarCadastro(nome, email);
        cadastro.preencherFormularioCadastro();
        cadastro.verificarCadastroSucesso();
        cy.get('[data-qa="continue-button"]').click() 
        cadastro.deletarConta();


    });

    it('Caso de Teste 02: Login com email e senha corretos', () => {        
        cy.visit('https://www.automationexercise.com/login') 
        cadastro.iniciarCadastro(nome, email); 
        cadastro.preencherFormularioCadastro();
        cy.get('[data-qa="continue-button"]').click()
        login.efetuarLogout();      
        login.efetuarLogin(email, senha);
        cadastro.deletarConta();         
    });
    
    it.only('Caso de Teste 03: Login com email e senha incorretos', () => {

        // ACT
        cy.visit('https://www.automationexercise.com/login')
        login.efetuarLogin('pgatz-aut-1791628681021@mail.com', '758621');
        
        // ASSERTION: Verifica se o login foi bem-sucedido
        verificarLoginFalha();

    });

    it('Caso de Teste 04: Logout', () => {

        // ACT
        cy.visit('https://www.automationexercise.com/login')
        login.efetuarLogin('pgats-aut-1791628681021@mail.com', '123456');
        verificarLoginSucesso();    
        login.efetuarLogout();
        verificarLogoutSucesso();
        
    });

    it('Caso de Teste 05: Registrar Usuário com email já existente', () => {
        cy.visit('https://www.automationexercise.com/') 
        cadastrarUsuarioExistente('PGATS Aut', 'pgats-aut-1791628681021@mail.com');
        cadastro.verificarCadastroExistente();
    });

    it('Caso de Teste 08: Verificar Todos os Produtos e Página de Detalhes do Produto', () => {
        cy.visit('https://www.automationexercise.com')
        cy.contains('Full-Fledged practice website for Automation Engineers').should('be.visible')
        cy.get('a[href*="products"]').first().click()

        cy.contains('All Products').should('be.visible')
        cy.get('.features_items .product-image-wrapper').should('be.visible')
        cy.get('.features_items a[href*="/product_details/"]').first().click()

        cy.url().should('include', '/product_details/')
        cy.get('.product-information h2').should('be.visible')
        cy.get('.product-information').should('contain.text', 'Category:')
            .and('contain.text', 'Rs.')
            .and('contain.text', 'Availability:')
            .and('contain.text', 'Condition:')
            .and('contain.text', 'Brand:')
    })

    it('Caso de Teste 09: Pesquisar produto', () => {
        cy.visit('https://www.automationexercise.com')
        cy.contains('Full-Fledged practice website for Automation Engineers').should('be.visible')
        cy.get('a[href*="products"]').first().click()
        cy.contains('All Products').should('be.visible')

        cy.get('#search_product').type('top')
        cy.get('#submit_search').click()

        cy.contains('Searched Products').should('be.visible')
        cy.get('.features_items .product-image-wrapper')
            .should('have.length.greaterThan', 0)
            .each(($product) => {
                cy.wrap($product)
                    .find('.productinfo p')
                    .should('be.visible')
            })
    })

    it.only('Caso de Teste 10: Verificar a assinatura na página inicial', () => {
        cy.visit('https://www.automationexercise.com')
        cy.contains('Full-Fledged practice website for Automation Engineers').should('be.visible')
        cy.get('footer').scrollIntoView()
        cy.contains('Subscription').should('be.visible') //`pgats-aut-${Date.now()}@mail.com`
        cy.get('#susbscribe_email').type(`case-test-${Date.now()}@mail.com`)
        cy.get('#subscribe').click()
        cy.get('#success-subscribe')
            .should('be.visible')
            .and('contain.text', 'You have been successfully subscribed!')
    })

    it('Caso de Teste 15: Fazer pedido registrando antes do checkout', () => {
        cy.visit('https://www.automationexercise.com/')
        cy.get('a[href*=login]').click();
        cadastro.iniciarCadastro(nome, email);
        cadastro.preencherFormularioCadastro();
        cadastro.verificarCadastroSucesso();
        cy.get('[data-qa="continue-button"]').click()
        cy.get('a > b').should('contain', 'PGATS Aut');

        cy.get('a[href*="products"]').first().click()
        cy.contains('All Products').should('be.visible')
        cy.get('.features_items .product-image-wrapper').should('be.visible')

        ;[1, 2].forEach((productId) => {
            cy.get(`a.add-to-cart[data-product-id="${productId}"]`)
                .first()
                .click({ force: true })
            cy.contains('Added!').should('be.visible')
            cy.contains('Continue Shopping').click()
        })

        cy.get('a[href="/view_cart"]').first().click()
        cy.contains('Shopping Cart').should('be.visible')
        cy.get('#cart_info tr[id^="product-"]').should('have.length', 2)
        cy.get('#product-1').should('be.visible')
        cy.get('#product-2').should('be.visible')
        cy.contains('Proceed To Checkout').click()

        cy.get('.checkout-information').should('be.visible')
        cy.get('#address_delivery > .address_city').should('contain.text', 'Taboquinha Anápolis')
        cy.get('#product-1 > .cart_description > h4 > a').should('contain.text', 'Blue Top')
        cy.get('#product-2 > .cart_description > h4 > a').should('contain.text', 'Men Tshirt')
        cy.get('.form-control').type('Lorem ipsum sollicitudin gravida a pellentesque egestas laoreet porttitor egestas, urna metus urna rutrum viverra velit eros')

        cy.contains('Place Order').click()
        cy.get('[data-qa="name-on-card"]').type(nome)
        cy.get('[data-qa="card-number"]').type('9632541235478521')
        cy.get('[data-qa="cvc"]').type('007')
        cy.get('[data-qa="expiry-month"]').type('10')
        cy.get('[data-qa="expiry-year"]').type('2027')
        cy.get('[data-qa="pay-button"]').should('be.visible').click()
        cy.get('.alert-success').should('contain.text', 'You have been successfully subscribed!')
        cy.contains('Delete Account').click()
        cy.contains('Account Deleted!').should('be.visible')
        cy.get('[data-qa="continue-button"]').click()    

    })

    it('Caso de Teste 16: Realizar Pedido: Fazer login antes de finalizar a compra', () => {

        cy.visit('https://www.automationexercise.com/')
        cy.get('a[href*=login]').click();
        cadastro.iniciarCadastro(nome, email);
        cadastro.preencherFormularioCadastro();
        cadastro.verificarCadastroSucesso();
        cy.get('[data-qa="continue-button"]').click()
        cy.get('a[href*="logout"]').click()        

        cy.get('[data-qa="login-email"]').type(email)
        cy.get('[data-qa="login-password"]').type(senha)
        cy.get('[data-qa="login-button"]').click()
        cy.get(':nth-child(10) > a').should('contain', 'Logged in as PGATS Aut')


        cy.get('a[href*="products"]').first().click()
        cy.contains('All Products').should('be.visible')
        cy.get('.features_items .product-image-wrapper').should('be.visible')

        ;[1, 2].forEach((productId) => {
            cy.get(`a.add-to-cart[data-product-id="${productId}"]`)
                .first()
                .click({ force: true })
            cy.contains('Added!').should('be.visible')
            cy.contains('Continue Shopping').click()
        })

        cy.get('a[href="/view_cart"]').first().click()
        cy.contains('Proceed To Checkout').click()
        cy.get('.checkout-information').should('be.visible')
        cy.get('#address_delivery > .address_city').should('contain.text', 'Taboquinha Anápolis')
        cy.get('#product-1 > .cart_description > h4 > a').should('contain.text', 'Blue Top')
        cy.get('#product-2 > .cart_description > h4 > a').should('contain.text', 'Men Tshirt')
        
        cy.get('.form-control').type('Lorem ipsum sollicitudin gravida a pellentesque egestas laoreet porttitor egestas, urna metus urna rutrum viverra velit eros')

        cy.contains('Place Order').click()
        cy.get('[data-qa="name-on-card"]').type(nome)
        cy.get('[data-qa="card-number"]').type('9632541235478521')
        cy.get('[data-qa="cvc"]').type('007')
        cy.get('[data-qa="expiry-month"]').type('10')
        cy.get('[data-qa="expiry-year"]').type('2027')
          
        const validacaoMensagem = cadastro.validarMensagemTemporaria('#success_message > .alert-success', 'Your order has been placed successfully!');
        cy.get('[data-qa="pay-button"]').should('be.visible').click();
        validacaoMensagem;

        cy.contains('Delete Account').click()
        cy.contains('Account Deleted!').should('be.visible')
        cy.get('[data-qa="continue-button"]').click() 
    })   

});




function verificarLoginSucesso(){
    cy.get('a > b').should('contain', 'PGATS Aut');
}

function verificarLoginFalha(){
    cy.contains('Your email or password is incorrect!').should('be.visible');
}



function verificarLogoutSucesso(){
    cy.url().should('include', '/login');
    cy.get('.login-form > h2').should('contain', 'Login to your account');
}

function cadastrarUsuarioExistente(name, email){
    cy.get('a[href*=login]').click();
    cy.get('[data-qa="signup-name"]').type(name)
    cy.get('[data-qa="signup-email"]').type(email)
    cy.get('[data-qa="signup-button"]').click()
}



// function validarMensagemTemporaria(seletor, mensagemEsperada) {

//     return cy.window().then((win) => {

//         return new Cypress.Promise((resolve, reject) => {

//             const observer = new win.MutationObserver(() => {

//                 const elemento = win.document.querySelector(seletor);

//                 if (
//                     elemento &&
//                     elemento.textContent.includes(mensagemEsperada)
//                 ) {

//                     observer.disconnect();
//                     win.clearTimeout(timeout);

//                     resolve(elemento.textContent.trim());
//                 }
//             });

//             const timeout = win.setTimeout(() => {

//                 observer.disconnect();

//                 reject(new Error(
//                     `Mensagem não exibida: ${mensagemEsperada}`
//                 ));

//             }, 10000);

//             observer.observe(win.document.body, {
//                 childList: true,
//                 subtree: true,
//                 characterData: true
//             });

//             // Verifica se a mensagem já está presente
//             const elemento = win.document.querySelector(seletor);

//             if (
//                 elemento &&
//                 elemento.textContent.includes(mensagemEsperada)
//             ) {

//                 observer.disconnect();
//                 win.clearTimeout(timeout);

//                 resolve(elemento.textContent.trim());
//             }

//         });

//     }).then((textoEncontrado) => {

//         expect(textoEncontrado).to.contain(mensagemEsperada);

//     });
// }