function efetuarLogin(email, senha){
    
    cy.get('[data-qa="login-email"]').type(email)
    cy.get('[data-qa="login-password"]').type(senha)
    cy.get('[data-qa="login-button"]').click()  
}

function efetuarLogout(){
    cy.get('a[href*="logout"]').should('be.visible').click();
    
}

module.exports = {
    efetuarLogin,
    efetuarLogout
}